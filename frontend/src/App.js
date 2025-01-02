import React, { useState } from 'react';
import CrimeMap from './components/CrimeMap';
import Filters from './components/Filters';

function App() {
  const [filterParams, setFilterParams] = useState({});

  return (
    <div>
      <h1>Crime Hotspot Visualization</h1>
      <Filters onFilter={setFilterParams} />
      <CrimeMap filterParams={filterParams} />
    </div>
  );
}

export default App;
