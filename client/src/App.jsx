import React, { useReducer, useEffect, useState } from "react";
import EventList from "./components/EventList.jsx";
import EventForm from "./components/EventForm.jsx";
import EventFilter from "./components/EventFilter.jsx";
import EditEventForm from "./components/EditEventForm.jsx";

// Initial state
const initialState = {
  events: [],
  selectedEvent: null,
  filteredEvents: [],
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.payload, filteredEvents: action.payload };
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload], filteredEvents: [...state.events, action.payload] };
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter(event => event.band.id !== action.payload), filteredEvents: state.filteredEvents.filter(event => event.band.id !== action.payload) };
    case "SET_SELECTED_EVENT":
      return { ...state, selectedEvent: action.payload };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map(event => (event.band.id === action.payload.band.id ? action.payload : event)),
        filteredEvents: state.filteredEvents.map(event => (event.band.id === action.payload.band.id ? action.payload : event)),
        selectedEvent: null, // Deselect after editing
      };
    case "FILTER_EVENTS":
      return {
        ...state,
        filteredEvents: state.events.filter(event => {
          const matchDate = action.payload.date ? event.date.includes(action.payload.date) : true;
          const matchBand = action.payload.band ? event.band.name.toLowerCase().includes(action.payload.band.toLowerCase()) : true;
          const matchVenue = action.payload.venue ? event.venue.name.toLowerCase().includes(action.payload.venue.toLowerCase()) : true;
          return matchDate && matchBand && matchVenue;
        })
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Fetch events from API
    fetch("/api/events")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => dispatch({ type: "SET_EVENTS", payload: data }))
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  const handleAddEvent = (newEvent) => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    })
      .then(response => response.json())
      .then(data => dispatch({ type: "ADD_EVENT", payload: data }))
      .catch(error => console.error("Error adding event:", error));
  };

  const handleDeleteEvent = (eventId) => {
    fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => dispatch({ type: "DELETE_EVENT", payload: eventId }))
      .catch(error => console.error("Error deleting event:", error));
  };

  const handleEditEvent = (event) => {
    dispatch({ type: "SET_SELECTED_EVENT", payload: event });
  };

  const handleUpdateEvent = (updatedEvent) => {
    fetch(`/api/events/${updatedEvent.band.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent)
    })
      .then(response => response.json())
      .then(data => dispatch({ type: "UPDATE_EVENT", payload: data }))
      .catch(error => console.error("Error updating event:", error));
  };

  const handleFilterEvents = (filters) => {
    const queryParams = new URLSearchParams(filters).toString(); // Convert filters to query string
    fetch(`/api/events/search?${queryParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => dispatch({ type: "SET_EVENTS", payload: data }))
      .catch((error) => console.error("Error fetching filtered events:", error));
  };

  return (
    <div>
      <h1>Event Management</h1>
      <EventForm onAddEvent={handleAddEvent} />
      <EventFilter onFilterEvents={handleFilterEvents} />
      <EventList events={state.filteredEvents} onDeleteEvent={handleDeleteEvent} onEditEvent={handleEditEvent} />
      {state.selectedEvent && (
        <EditEventForm event={state.selectedEvent} onUpdateEvent={handleUpdateEvent} />
      )}
    </div>
  );
};

export default App;
