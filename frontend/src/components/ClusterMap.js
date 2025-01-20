import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Define projections for coordinate transformation
const EPSG3857 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';
const EPSG4326 = '+proj=longlat +datum=WGS84 +no_defs';

// Function to transform coordinates from Web Mercator to WGS84
const transformCoordinates = (longitude, latitude) => {
  const [lng, lat] = proj4(EPSG3857, EPSG4326, [longitude, latitude]);
  return { lng, lat };
};

const ClusterMap = () => {
  const [clusters, setClusters] = useState([]);

  const fetchClusters = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/dbscan-clustering/");
      if (!response.ok) throw new Error('Failed to fetch cluster data');
      const data = await response.json();

      // Transform coordinates from EPSG:3857 to EPSG:4326
      const transformedClusters = data.data.map((cluster) => {
        const { lng, lat } = transformCoordinates(cluster.longitude, cluster.latitude);
        return { ...cluster, longitude: lng, latitude: lat }; // Replace with converted values
      });

      setClusters(transformedClusters);
    } catch (error) {
      console.error('Error fetching clusters:', error);
      setClusters([]);
    }
  };

  useEffect(() => {
    fetchClusters();

    return () => {
      console.log('ClusterMap unmounted'); // Cleanup logic, if necessary
    };
  }, []);

  return (
    <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '80vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {clusters
        .filter((cluster) => Number.isFinite(cluster.latitude) && Number.isFinite(cluster.longitude)) // Filter invalid data
        .map((cluster, index) => (
          <Marker
            key={`${cluster.id}-${index}`}
            position={[cluster.latitude, cluster.longitude]} // Use converted coordinates
          >
            <Popup>
              <strong>Cluster {cluster.cluster}</strong><br />
              Latitude: {cluster.latitude}<br />
              Longitude: {cluster.longitude}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default ClusterMap;
