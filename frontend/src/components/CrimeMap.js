import React, { useEffect, useState } from 'react';
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
  return proj4(EPSG3857, EPSG4326, [longitude, latitude]);
};

const CrimeMap = ({ filterParams }) => {
  const [crimeData, setCrimeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch crime data based on filters and current page
  const fetchCrimeData = async (page = 1) => {
    try {
      const query = new URLSearchParams({ ...filterParams, page }).toString();
      const response = await fetch(`http://127.0.0.1:8000/api/filter-crime/?${query}`);
      if (!response.ok) throw new Error('Failed to fetch crime data');
      const data = await response.json();

      // Transform coordinates for each crime
      const transformedData = data.data.map((crime) => {
        const [lng, lat] = transformCoordinates(crime.longitude, crime.latitude);
        return { ...crime, longitude: lng, latitude: lat };
      });

      setCrimeData(transformedData);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error('Error fetching crime data:', error);
    }
  };

  // Fetch data whenever filterParams or currentPage changes
  useEffect(() => {
    fetchCrimeData(currentPage);
  }, [filterParams, currentPage]);

  return (
    <div>
      <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '80vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {Array.isArray(crimeData) && crimeData.map((crime) => (
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
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CrimeMap;
