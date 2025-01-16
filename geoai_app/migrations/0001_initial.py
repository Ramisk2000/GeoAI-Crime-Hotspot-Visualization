# Generated by Django 5.1.4 on 2025-01-02 03:30

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CrimeData",
            fields=[
                ("ogc_fid", models.AutoField(primary_key=True, serialize=False)),
                ("fid", models.IntegerField(blank=True, null=True)),
                ("year", models.IntegerField()),
                ("report_date", models.DateField()),
                ("occur_date", models.DateField()),
                ("weekday", models.CharField(max_length=20)),
                ("offsummary", models.TextField()),
                ("primviolat", models.CharField(max_length=255)),
                (
                    "neighbourhood",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("sector", models.CharField(blank=True, max_length=255, null=True)),
                ("division", models.CharField(blank=True, max_length=255, null=True)),
                ("censustra", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "wkb_geometry",
                    django.contrib.gis.db.models.fields.PointField(srid=4326),
                ),
            ],
            options={
                "verbose_name": "Crime Data",
                "verbose_name_plural": "Crime Data",
                "db_table": "crime_data",
                "managed": False,
            },
        ),
    ]
