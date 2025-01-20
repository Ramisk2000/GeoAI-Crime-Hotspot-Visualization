from django.http import JsonResponse
from .models import CrimeData
from django.core.paginator import Paginator
from sklearn.cluster import DBSCAN
import numpy as np
from esda.moran import Moran
from libpysal.weights import lat2W
from .ml_model import train_and_save_model, predict_hotspots, calculate_distance
import joblib
import pandas as pd
from datetime import datetime
from pyproj import Transformer



# Initialize a global variable 'data' for formatted crime data
def initialize_global_data():
    return [
        {
            "id": crime.ogc_fid,
            "fid": crime.fid,
            "year": crime.year,
            "report_date": crime.reportdate,
            "occur_date": crime.occurdate,
            "weekday": crime.weekday,
            "summary": crime.offsummary,
            "violation": crime.primviolat,
            "neighborhood": crime.neighbourh,
            "sector": crime.sector,
            "division": crime.division,
            "census_tract": crime.censustra,
            "longitude": crime.wkb_geometry.x,
            "latitude": crime.wkb_geometry.y,
        }
        for crime in CrimeData.objects.all()[:50]



    ]


# Refresh global data
data = initialize_global_data()




def get_crime_data(request):
    return JsonResponse(data, safe=False)

# API to filter crime data
def filter_crime_data(request):
    global data
    crime_type = request.GET.get('primviolat', None)
    date = request.GET.get('occurdate', None)
    neighborhood = request.GET.get('neighborhood', None)
    year = request.GET.get('year', None)

    filtered_data = [
        crime for crime in data
        if (not crime_type or crime['violation'] == crime_type) and
           (not date or crime['occur_date'] == date) and
           (not neighborhood or crime['neighborhood'] == neighborhood) and
           (not year or crime['year'] == int(year))
    ]

    return JsonResponse(filtered_data, safe=False)

# API for DBSCAN clustering
def dbscan_clustering(request):
    global data
    coordinates = np.array([[crime['longitude'], crime['latitude']] for crime in data])

    if coordinates.size == 0:
        return JsonResponse({"data": [], "message": "No data for clustering."}, safe=False)

    db = DBSCAN(eps=0.01, min_samples=5).fit(coordinates)
    labels = db.labels_

    clustered_data = [
        {
            "longitude": data[idx]['longitude'],
            "latitude": data[idx]['latitude'],
            "cluster": int(label),
        }
        for idx, label in enumerate(labels)
    ]

    return JsonResponse({"data": clustered_data}, safe=False)

# API for Moran's I
def morans_i(request):
    global data
    coordinates = np.array([[crime['longitude'], crime['latitude']] for crime in data])

    if coordinates.size == 0:
        return JsonResponse({"error": "Insufficient data for Moran's I."}, status=400)

    weights = lat2W(coordinates.shape[0])
    moran = Moran(coordinates[:, 0], weights)

    return JsonResponse({
        "moran_i": moran.I,
        "p_value": moran.p_sim,
        "z_score": moran.z_sim,
    })

# API to fetch heatmap data
def heatmap_data(request):
    global data
    try:
        # Extract latitude and longitude from the global `data` variable
        coordinates = [
            [crime['latitude'], crime['longitude']]
            for crime in data
            if crime['latitude'] and crime['longitude']  # Ensure valid coordinates
        ]

        return JsonResponse({"coordinates": coordinates}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)






def predict_hotspots(request):
    try:
        limit = int(request.GET.get('limit', 50))  # Default limit to 50
        transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326")

        queryset = list(CrimeData.objects.all())
        sampled_queryset = random.sample(queryset, min(len(queryset), limit))  # Random sample

        features = [
            [
                crime.wkb_geometry.y,  # Latitude in Web Mercator
                crime.wkb_geometry.x,  # Longitude in Web Mercator
                crime.occurdate.hour if crime.occurdate else 0,
                crime.occurdate.month if crime.occurdate else 0,
                crime.occurdate.weekday() if crime.occurdate else 0,
            ]
            for crime in sampled_queryset if crime.wkb_geometry
        ]

        # Load the trained model
        model = joblib.load('crime_model_optimized.joblib')
        predictions = model.predict(features)

        # Convert coordinates and prepare response
        response_data = [
            {
                "latitude": transformer.transform(feature[0], feature[1])[1],  # Convert latitude
                "longitude": transformer.transform(feature[0], feature[1])[0],  # Convert longitude
                "prediction": int(pred)
            }
            for feature, pred in zip(features, predictions)
        ]

        return JsonResponse({"predictions": response_data}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)