import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [crimeType, setCrimeType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const applyFilters = () => {
    onFilter({ crimeType, startDate, endDate });
  };

  return (
    <div className="filters">
      <input type="text" placeholder="Crime Type" value={crimeType} onChange={(e) => setCrimeType(e.target.value)} />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;
