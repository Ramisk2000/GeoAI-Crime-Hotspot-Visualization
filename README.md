# GeoAI-Crime-Hotspot-Visualization


## Project Description
This application visualizes crime hotspots by analyzing historical crime data using GeoAI techniques. It employs clustering algorithms, spatial autocorrelation, and predictive modeling to identify and forecast crime patterns. Interactive maps and dashboards enable users to explore data and analyze trends.

## Features

1. **Data Ingestion and Processing**
   - Support for formats like CSV and GeoJSON.
   - Data cleaning and demographic data integration.

2. **Visualization Capabilities**
   - Interactive maps with heatmaps and choropleth visualizations.
   - Time-series analysis and filtering options.

3. **Hotspot Identification**
   - Clustering (DBSCAN, K-Means) and spatial analysis metrics.
   - Hotspot visualization on maps.

4. **Predictive Modeling**
   - Machine learning for crime trend predictions.
   - Integration of spatiotemporal patterns.

5. **User Interface**
   - Intuitive dashboard with real-time controls.

## Technologies Used

- **Frontend:** React.js, D3.js
- **Backend:** Python, Flask/Django
- **Database:** PostgreSQL with PostGIS
- **GeoAI Tools:** PySAL, scikit-learn, geopandas
- **Mapping Libraries:** Leaflet, Mapbox

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_directory>



   pip install -r requirements.txt

# Step 2: Install Node.js dependencies
npm install

# Step 3: Set up the database
# Ensure PostgreSQL is running and create a database with PostGIS extension
psql -U postgres -c "CREATE DATABASE crime_hotspots;"
psql -U postgres -d crime_hotspots -c "CREATE EXTENSION postgis;"

# Apply database migrations
python manage.py migrate

# Step 4: Run the backend server
python manage.py runserver

# Step 5: Run the frontend server
npm start

# Access the application
# Open a browser and go to: http://localhost:3000