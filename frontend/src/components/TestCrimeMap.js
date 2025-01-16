import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the red icon
const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Hardcoded data for testing
const hardcodedData = [
  { id: 1, latitude: 37.7749, longitude: -122.4194, violation: "Theft" },
  { id: 2, latitude: 37.7849, longitude: -122.4294, violation: "Assault" },
  { id: 3, latitude: 37.7649, longitude: -122.4094, violation: "Vandalism" },
];

const TestCrimeMap = () => {
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{ height: '80vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {hardcodedData.map((crime) => (
        <Marker
          key={crime.id}
          position={[crime.latitude, crime.longitude]}
          icon={redIcon}
        >
          <Popup>
            <strong>{crime.violation}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TestCrimeMap;
