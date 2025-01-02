from django.urls import path
from . import views

urlpatterns = [
    path('crime-data/', views.get_crime_data, name='get_crime_data'),
    path('filter-crime/', views.filter_crime_data, name='filter_crime_data'),
]
