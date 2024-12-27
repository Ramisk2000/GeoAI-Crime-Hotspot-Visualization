import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CrimeMap = () => {
  const [crimeData, setCrimeData] = useState([]);

  // Fetch crime data from the Django API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/crime-data/')
      .then(response => response.json())
      .then(data => setCrimeData(data));
  }, []);

  return (
    <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {crimeData.map(crime => (
        <Marker key={crime.id} position={[crime.latitude, crime.longitude]}>
          <Popup>{crime.type} - {new Date(crime.date).toLocaleDateString()}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CrimeMap;
