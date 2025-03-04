import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';

// Define projections for coordinate transformation
const EPSG3857 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';
const EPSG4326 = '+proj=longlat +datum=WGS84 +no_defs';

// Define the red icon
const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Function to transform coordinates from EPSG:3857 to EPSG:4326
const transformCoordinates = (longitude, latitude) => {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    console.error(`Invalid coordinates: longitude=${longitude}, latitude=${latitude}`);
    return null; // Return null for invalid coordinates
  }
  return proj4(EPSG3857, EPSG4326, [longitude, latitude]);
};

const CrimeMap = ({ filterParams }) => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCrimeData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filterParams).toString();
      const response = await fetch(`http://127.0.0.1:8000/api/filter-crime/?${query}`);
      if (!response.ok) throw new Error('Failed to fetch crime data');
      const data = await response.json();

      // Transform coordinates for each crime and filter out invalid entries
      const transformedData = data
        .map((crime) => {
          const transformed = transformCoordinates(crime.longitude, crime.latitude);
          if (!transformed) return null; // Skip invalid coordinates
          const [lng, lat] = transformed;
          return { ...crime, longitude: lng, latitude: lat };
        })
        .filter((crime) => crime !== null); // Remove null entries

      setCrimeData(transformedData);
    } catch (error) {
      console.error('Error fetching crime data:', error);
      setCrimeData([]);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchCrimeData();
  }, [fetchCrimeData]);

  if (loading) {
    return <div>Loading crime data...</div>;
  }

  return (
    <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '80vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {crimeData.map((crime) => (
        <Marker
          key={crime.id}
          position={[crime.latitude, crime.longitude]}
          icon={redIcon}
        >
          <Popup>
            <strong>{crime.violation}</strong><br />
            Neighborhood: {crime.neighborhood}<br />
            Year: {crime.year}<br />
            Occurred: {new Date(crime.occur_date).toLocaleDateString()}<br />
            Reported: {new Date(crime.report_date).toLocaleDateString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CrimeMap;
