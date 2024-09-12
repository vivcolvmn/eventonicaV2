import React, { useState } from "react";

const EventForm = ({ onAddEvent }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    ticketPrice: "",
    band: { name: "" },
    venue: { name: "", address: "" }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(formData);
    setFormData({ date: "", time: "", ticketPrice: "", band: { name: "" }, venue: { name: "", address: "" } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Event</h3>
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
        onChange={e => setFormData({ ...formData, band: { name: e.target.value } })}
      />
      <input
        type="text"
        placeholder="Venue Name"
        value={formData.venue.name}
        onChange={e => setFormData({ ...formData, venue: { name: e.target.value, address: formData.venue.address } })}
      />
      <input
        type="text"
        placeholder="Venue Address"
        value={formData.venue.address}
        onChange={e => setFormData({ ...formData, venue: { name: formData.venue.name, address: e.target.value } })}
      />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
