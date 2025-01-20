from django.contrib.gis.db import models

class CrimeData(models.Model):
    ogc_fid = models.AutoField(primary_key=True)  # Auto-incrementing ID
    fid = models.IntegerField(null=True, blank=True)  # Secondary ID, if applicable
    year = models.IntegerField()  # Year of the crime occurrence
    reportdate = models.DateField()  # Date the crime was reported
    occurdate = models.DateField()  # Date the crime occurred
    weekday = models.CharField(max_length=20)  # Weekday of the occurrence
    offsummary = models.TextField()  # Offense summary
    primviolat = models.CharField(max_length=255)  # Primary violation
    neighbourh = models.CharField(max_length=255, null=True, blank=True)  # Neighborhood
    sector = models.CharField(max_length=255, null=True, blank=True)  # Sector
    division = models.CharField(max_length=255, null=True, blank=True)  # Division
    censustra = models.CharField(max_length=255, null=True, blank=True)  # Census tract
    wkb_geometry = models.PointField()  # Geospatial point for crime location

    class Meta:
        db_table = 'crime_data'  # Map to the existing database table
        verbose_name = "Crime Data"
        verbose_name_plural = "Crime Data"
        managed = False

    def __str__(self):
        return f"{self.primviolat} on {self.occurdate} at {self.neighbourh}"
