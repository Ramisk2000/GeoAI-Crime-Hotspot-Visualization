from django.http import JsonResponse
from .models import CrimeData
from django.core.paginator import Paginator

# API to fetch all crime data
def get_crime_data(request):
    crimes = CrimeData.objects.all()[:10]  # Return only 100 rows for testing
    data = [
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
        for crime in crimes
    ]
    return JsonResponse(data, safe=False)

# API to filter crime data



def filter_crime_data(request):
    crime_type = request.GET.get('primviolat', None)
    date = request.GET.get('occurdate', None)
    neighborhood = request.GET.get('neighborhood', None)
    year = request.GET.get('year', None)

    page_number = request.GET.get('page', 1)
    items_per_page = request.GET.get('items_per_page', 100)  # Adjust as needed

    filters = {}
    if crime_type:
        filters['primviolat'] = crime_type
    if date: 
        filters['occurdate'] = date
    if neighborhood:
        filters['neighbourh'] = neighborhood
    if year:
        filters['year'] = year

    # Apply filters and paginate results
    crimes = CrimeData.objects.filter(**filters)
    paginator = Paginator(crimes, items_per_page)
    page = paginator.get_page(page_number)

    data = [
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
        for crime in page.object_list
    ]

    return JsonResponse({
        "data": data,
        "total_pages": paginator.num_pages,
        "current_page": page.number,
        "items_per_page": items_per_page,
    })

