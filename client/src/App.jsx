import React, { useReducer, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventFilter from './components/EventFilter';
import EventList from './components/EventList';
import EditEventForm from './components/EditEventForm';
import './App.css'

const initialState = {
  events: [],
  likedEvents: [],
  showEditForm: false,
  eventToEdit: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(event => event.id !== action.payload) };
    case 'LIKE_EVENT':
      return { ...state, likedEvents: [...state.likedEvents, action.payload] };
    case 'FILTER_EVENTS':
      return { ...state, events: action.payload };
    case 'SHOW_EDIT_FORM':
      return { ...state, showEditForm: true, eventToEdit: action.payload };
    case 'HIDE_EDIT_FORM':
      return { ...state, showEditForm: false, eventToEdit: null };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Fetch events from the backend
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'SET_EVENTS', payload: data });
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const handleAddEvent = (event) => {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'ADD_EVENT', payload: data });
      })
      .catch(err => console.error('Error adding event:', err));
  };

  const handleDeleteEvent = (id) => {
    fetch(`/api/events/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'DELETE_EVENT', payload: id });
      })
      .catch(err => console.error('Error deleting event:', err));
  };

  const handleLikeEvent = (event) => {
    dispatch({ type: 'LIKE_EVENT', payload: event });
  };

  const handleFilterEvents = (filters) => {
    let query = '/api/events/search?';
    if (filters.date) query += `date=${filters.date}&`;
    if (filters.band) query += `band=${filters.band}&`;
    if (filters.venue) query += `venue=${filters.venue}&`;

    if (filters.liked) {
      dispatch({ type: 'FILTER_EVENTS', payload: state.likedEvents });
    } else {
      fetch(query)
        .then(res => res.json())
        .then(data => {
          dispatch({ type: 'FILTER_EVENTS', payload: data });
        })
        .catch(err => console.error('Error filtering events:', err));
    }
  };

  const handleEditEvent = (event) => {
    dispatch({ type: 'SHOW_EDIT_FORM', payload: event });
  };

  const handleUpdateEvent = (updatedEvent) => {
    fetch(`/api/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'UPDATE_EVENT', payload: data });
        dispatch({ type: 'HIDE_EDIT_FORM' });
      })
      .catch(err => console.error('Error updating event:', err));
  };

  const handleCancelEdit = () => {
    dispatch({ type: 'HIDE_EDIT_FORM' });
  };

  return (
    <div>
      <h1>SCA Events</h1>
      <EventForm onAddEvent={handleAddEvent} />
      <EventFilter onFilter={handleFilterEvents} />
      {state.showEditForm ? (
        <EditEventForm event={state.eventToEdit} onUpdateEvent={handleUpdateEvent} onCancel={handleCancelEdit} />
      ) : (
        <EventList
          events={state.events}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onLike={handleLikeEvent}
        />
      )}
    </div>
  );
};

export default App;
