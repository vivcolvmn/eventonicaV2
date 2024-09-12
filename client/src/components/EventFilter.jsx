import React, { useState } from "react";

const EventFilter = ({ onFilterEvents }) => {
  const [filters, setFilters] = useState({
    date: "",
    band: "",
    venue: ""
  });

  const handleFilter = (e) => {
    e.preventDefault();
    onFilterEvents(filters);
  };

  return (
    <form onSubmit={handleFilter}>
      <h3>Filter Events</h3>
      <input
        type="text"
        placeholder="Date"
        value={filters.date}
        onChange={e => setFilters({ ...filters, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Band"
        value={filters.band}
        onChange={e => setFilters({ ...filters, band: e.target.value })}
      />
      <input
        type="text"
        placeholder="Venue"
        value={filters.venue}
        onChange={e => setFilters({ ...filters, venue: e.target.value })}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default EventFilter;
