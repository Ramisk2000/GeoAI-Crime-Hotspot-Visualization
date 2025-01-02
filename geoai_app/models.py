from django.contrib.gis.db import models

class CrimeData(models.Model):
    id = models.AutoField(primary_key=True)
    primviolat = models.CharField(max_length=255)  # Primary violation
    offsummary = models.TextField()               # Offense summary
    neighbourhood = models.CharField(max_length=255)  # Neighborhood
    reportdate = models.DateField()               # Report date
    occurdate = models.DateField()                # Occurrence date
    weekday = models.CharField(max_length=20)     # Weekday
    wkb_geometry = models.PointField()            # GIS geometry

    class Meta:
        db_table = 'crime_data'
