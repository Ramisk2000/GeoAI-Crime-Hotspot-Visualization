import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CrimeMap = ({ filterParams }) => {
  const [crimeData, setCrimeData] = useState([]);

  // Fetch crime data with optional filters
  useEffect(() => {
    let query = "";
    if (filterParams) {
      query = Object.entries(filterParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }

    fetch(`http://127.0.0.1:8000/api/filter-crime/?${query}`)
      .then((response) => response.json())
      .then((data) => setCrimeData(data));
  }, [filterParams]);

  return (
    <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {crimeData.map((crime) => (
        <Marker key={crime.id} position={[crime.latitude, crime.longitude]}>
          <Popup>
            <strong>{crime.violation}</strong><br />
            {crime.summary}<br />
            {crime.neighborhood}<br />
            Occurred: {new Date(crime.occur_date).toLocaleDateString()}<br />
            Reported: {new Date(crime.report_date).toLocaleDateString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CrimeMap;
