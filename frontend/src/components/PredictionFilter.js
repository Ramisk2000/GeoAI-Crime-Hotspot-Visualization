import React, { useState } from 'react';

const PredictionFilter = ({ onPredict }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [hour, setHour] = useState('');

  const handlePredict = () => {
    if (!latitude || !longitude || hour === '') {
      alert('Please provide valid Latitude, Longitude, and Hour.');
      return;
    }

    const params = { latitude, longitude, hour };
    if (typeof onPredict === 'function') {
      onPredict(params);
    } else {
      console.error('onPredict is not a function.');
    }
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
      <h4>Predict Crime Hotspots</h4>
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        style={{ padding: '10px', marginBottom: '5px', display: 'block' }}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        style={{ padding: '10px', marginBottom: '5px', display: 'block' }}
      />
      <input
        type="number"
        placeholder="Hour (0-23)"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        style={{ padding: '10px', marginBottom: '5px', display: 'block' }}
      />
      <button onClick={handlePredict} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>
        Predict
      </button>
    </div>
  );
};

export default PredictionFilter;
