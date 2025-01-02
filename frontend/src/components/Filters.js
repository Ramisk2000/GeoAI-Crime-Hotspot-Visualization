import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const applyFilters = () => {
    const filters = {};
    if (type) filters.type = type;
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    if (neighborhood) filters.neighborhood = neighborhood;

    onFilter(filters); // Pass the filters object to the parent component
  };

  return (
    <div className="filters" style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', marginBottom: '10px' }}>
      <h4>Filter Crime Data</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Crime Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Neighborhood"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
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
