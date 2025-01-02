from django.http import JsonResponse
from django.db import connection
from .models import CrimeData
from django.core.paginator import Paginator

def get_crime_data(request):
    crimes = CrimeData.objects.all()
    paginator = Paginator(crimes, 10)  # 10 records per page
    page_number = request.GET.get('page', 1)
    page = paginator.get_page(page_number)
    data = [
        {
            "id": crime.id,
            "violation": crime.primviolat,
            "summary": crime.offsummary,
            "neighborhood": crime.neighbourhood,
            "report_date": crime.reportdate,
            "occur_date": crime.occurdate,
            "weekday": crime.weekday,
            "longitude": crime.wkb_geometry.x,
            "latitude": crime.wkb_geometry.y,
        }
        for crime in page
    ]
    return JsonResponse({"data": data, "total_pages": paginator.num_pages}, safe=False)


def filter_crime_data(request):
    crime_type = request.GET.get('type', None)
    start_date = request.GET.get('start_date', None)
    end_date = request.GET.get('end_date', None)
    neighborhood = request.GET.get('neighborhood', None)

    filters = {}
    if crime_type:
        filters['primviolat'] = crime_type
    if start_date and end_date:
        filters['occurdate__range'] = (start_date, end_date)
    if neighborhood:
        filters['neighbourhood'] = neighborhood

    crimes = CrimeData.objects.filter(**filters)
    data = [
        {
            "id": crime.id,
            "violation": crime.primviolat,
            "summary": crime.offsummary,
            "neighborhood": crime.neighbourhood,
            "report_date": crime.reportdate,
            "occur_date": crime.occurdate,
            "weekday": crime.weekday,
            "longitude": crime.wkb_geometry.x,
            "latitude": crime.wkb_geometry.y,
        }
        for crime in crimes
    ]
    return JsonResponse(data, safe=False)
