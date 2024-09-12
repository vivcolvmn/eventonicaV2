import React from "react";

const EventList = ({ events, onDeleteEvent, onEditEvent }) => {
  return (
    <div>
      <h3>Event List</h3>
      {events.length > 0 ? (
        <ul>
          {events.map(event => (
            <li key={event.band.id}>
              <p>{event.date} - {event.band.name} at {event.venue.name}</p>
              <button onClick={() => onEditEvent(event)}>Edit</button>
              <button onClick={() => onDeleteEvent(event.band.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};

export default EventList;
