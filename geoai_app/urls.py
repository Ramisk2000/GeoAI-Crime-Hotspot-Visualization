from django.urls import path
from . import views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def options_view(request):
    response = JsonResponse({"message": "CORS options request handled"})
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

urlpatterns = [
    path('crime-data/', views.get_crime_data, name='get_crime_data'),
    path('filter-crime/', views.filter_crime_data, name='filter_crime_data'),
    path('debug-options/', options_view),
    path('dbscan-clustering/', views.dbscan_clustering, name='dbscan_clustering'),
    path('morans-i/', views.morans_i, name='morans_i'),
    path('heatmap-data/', views.heatmap_data, name='heatmap_data'),
    path('predict-hotspots/', views.predict_hotspots, name='predict_hotspots'),


]