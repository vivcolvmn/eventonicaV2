import React, { useState } from "react";

const EditEventForm = ({ event, onUpdateEvent }) => {
  const [formData, setFormData] = useState(event);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEvent(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Event</h3>
      <input
        type="text"
        placeholder="Date"
        value={formData.date}
        onChange={e => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Time"
        value={formData.time}
        onChange={e => setFormData({ ...formData, time: e.target.value })}
      />
      <input
        type="text"
        placeholder="Ticket Price"
        value={formData.ticketPrice}
        onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })}
      />
      <input
        type="text"
        placeholder="Band Name"
        value={formData.band.name}
        onChange={e => setFormData({ ...formData, band: { ...formData.band, name: e.target.value } })}
      />
      <input
        type="text"
        placeholder="Venue Name"
        value={formData.venue.name}
        onChange={e => setFormData({ ...formData, venue: { ...formData.venue, name: e.target.value } })}
      />
      <input
        type="text"
        placeholder="Venue Address"
        value={formData.venue.address}
        onChange={e => setFormData({ ...formData, venue: { ...formData.venue, address: e.target.value } })}
      />
      <button type="submit">Update Event</button>
    </form>
  );
};

export default EditEventForm;
