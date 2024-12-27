import React, { useState } from 'react';
import CrimeMap from './components/CrimeMap';
import Filters from './components/Filters';

const App = () => {
  const [filterParams, setFilterParams] = useState({});

  const fetchFilteredData = (filters) => {
    let query = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    fetch(`http://127.0.0.1:8000/api/filter-crime/?${query}`)
      .then(response => response.json())
      .then(data => setFilterParams(data));
  };

  return (
    <div>
      <Filters onFilter={fetchFilteredData} />
      <CrimeMap filterParams={filterParams} />
    </div>
  );
};

export default App;
