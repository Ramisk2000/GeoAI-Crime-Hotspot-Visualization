import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  // State for each filter
  const [violation, setViolation] = useState('');
  const [year, setYear] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [occurDate, setOccurDate] = useState('');

  // Apply filters by passing them to the parent component
  const applyFilters = () => {
    const filters = {};
    if (violation) filters.primviolat = violation; // Crime type
    if (year) filters.year = year; // Year of the crime
    if (neighborhood) filters.neighbourh = neighborhood; // Neighborhood
    if (occurDate) filters.occurdate = occurDate; // Specific occurrence date

    onFilter(filters); // Pass filters to the parent
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', marginBottom: '10px' }}>
      <h4>Filter Crime Data</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Crime Type (e.g., Theft)"
          value={violation}
          onChange={(e) => setViolation(e.target.value)}
          style={{ padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Year (e.g., 2020)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Neighborhood (e.g., Downtown)"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          style={{ padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          value={occurDate}
          onChange={(e) => setOccurDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <button
          onClick={applyFilters}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
