import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import HeatmapOverlay from 'leaflet-heatmap';

// Convert Web Mercator to WGS84 (latitude/longitude)
const webMercatorToLatLng = (x, y) => {
    const R2D = 180 / Math.PI;
    const A = 6378137; // Earth's radius in meters

    const lng = (x / A) * R2D;
    const lat = (2 * Math.atan(Math.exp(y / A)) - Math.PI / 2) * R2D;

    return [lat, lng];
};

const HeatLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        const heatmapOptions = {
            radius: 25,
            maxOpacity: 0.8,
            scaleRadius: true,
            useLocalExtrema: false,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'value',
        };

        // Convert coordinates to WGS84
        const formattedData = {
            max: 10,
            data: (data || []).map(([y, x]) => {
                const [lat, lng] = webMercatorToLatLng(x, y);
                return { lat, lng, value: 1 };
            }),
        };

        const heatmapLayer = new HeatmapOverlay(heatmapOptions);
        map.addLayer(heatmapLayer);
        heatmapLayer.setData(formattedData);

        return () => {
            map.removeLayer(heatmapLayer);
        };
    }, [map, data]);

    return null;
};

const HeatMap = () => {
    const [heatData, setHeatData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/heatmap-data/")
            .then((response) => response.json())
            .then((data) => {
                if (data.coordinates) {
                    setHeatData(data.coordinates);
                } else {
                    console.error("Unexpected API response:", data);
                }
            })
            .catch((error) => console.error("Error fetching heatmap data:", error));
    }, []);

    return (
        <MapContainer center={[45.4215, -75.6972]} zoom={12} style={{ height: '80vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <HeatLayer data={heatData} />
        </MapContainer>
    );
};

export default HeatMap;
