import React, { useReducer, useEffect } from "react";
import EventForm from "./components/EventForm";
import EditEventForm from "./components/EditEventForm";
import EventFilter from "./components/EventFilter";
import EventList from "./components/EventList";

// Initial state
const initialState = {
  events: [],
  filteredEvents: [],
  editingEvent: null
};

// Reducer function to handle state changes
function eventReducer(state, action) {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.payload, filteredEvents: action.payload };
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter(event => event.band.id !== action.payload) };
    case "SET_EDITING_EVENT":
      return { ...state, editingEvent: action.payload };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map(event =>
          event.band.id === action.payload.id ? { ...event, ...action.payload } : event
        ),
        editingEvent: null
      };
    case "FILTER_EVENTS":
      return { ...state, filteredEvents: action.payload };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Fetch events from the server
  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "SET_EVENTS", payload: data });
      });
  }, []);

  // Add a new event
  const handleAddEvent = event => {
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then(newEvent => {
        dispatch({ type: "ADD_EVENT", payload: newEvent });
      });
  };

  // Delete an event
  const handleDeleteEvent = id => {
    fetch(`/api/events/${id}`, { method: "DELETE" })
      .then(() => {
        dispatch({ type: "DELETE_EVENT", payload: id });
      });
  };

  // Update an event
  const handleUpdateEvent = updatedEvent => {
    fetch(`/api/events/${updatedEvent.band.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedEvent)
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE_EVENT", payload: data });
      });
  };

  // Search events
  const handleFilterEvents = (filters) => {
    const query = new URLSearchParams(filters).toString();
    fetch(`/api/events/search?${query}`)
      .then(res => res.json())
      .then(filteredEvents => {
        dispatch({ type: "FILTER_EVENTS", payload: filteredEvents });
      });
  };

  return (
    <div>
      <h1>Event Manager</h1>
      <EventForm onAddEvent={handleAddEvent} />
      <EventFilter onFilterEvents={handleFilterEvents} />
      <EventList
        events={state.filteredEvents}
        onDeleteEvent={handleDeleteEvent}
        onEditEvent={event => dispatch({ type: "SET_EDITING_EVENT", payload: event })}
      />
      {state.editingEvent && (
        <EditEventForm
          event={state.editingEvent}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
};

export default App;
