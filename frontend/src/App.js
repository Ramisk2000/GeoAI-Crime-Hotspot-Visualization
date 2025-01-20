import React, { useState } from 'react';

import Filters from './components/Filters';
import CrimeMap from './components/CrimeMap';
import ClusterMap from './components/ClusterMap';
import HeatMap from './components/HeatMap';
import PredictedHotspots from './components/PredictedHotspots';

function App() {
  const [filterParams, setFilterParams] = useState({}); // Filters for CrimeMap
  const [view, setView] = useState('crimeMap'); // View state for navigation

  // Render components based on the current view
  const renderView = () => {
    switch (view) {
      case 'crimeMap':
        return (
          <>
            <Filters onFilter={setFilterParams} />
            <CrimeMap filterParams={filterParams} />
          </>
        );
      case 'clusterMap':
        return <ClusterMap />;
      case 'heatMap':
        return <HeatMap />;
      case 'predictedHotspots':
        return <PredictedHotspots />;
      default:
        return <h2>Welcome to the Crime Data Visualization Portal</h2>;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <header style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontSize: '24px',
      }}>
        Crime Data Visualization Portal
      </header>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setView('crimeMap')}
          style={navButtonStyle}
        >
          Crime Map + Filters
        </button>
        <button
          onClick={() => setView('clusterMap')}
          style={navButtonStyle}
        >
          Cluster Map
        </button>
        <button
          onClick={() => setView('heatMap')}
          style={navButtonStyle}
        >
          Heat Map
        </button>
        <button
          onClick={() => setView('predictedHotspots')}
          style={navButtonStyle}
        >
          Predicted Hotspots
        </button>
      </nav>
      <main style={{ padding: '20px' }}>
        {renderView()}
      </main>
    </div>
  );
}

// Common button style for navigation
const navButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default App;
