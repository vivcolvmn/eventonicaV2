import express from 'express';
import cors from 'cors';
import { eventData } from './eventData.js'

const app = express();
app.use(cors());
app.use(express.json());

// Get all events
app.get("/api/events", (req, res) => {
  res.json(eventData);
});

// Search for events by date, band, or venue
// Search for events by date, band, or venue
app.get("/api/events/search", (req, res) => {
  const { date, band, venue } = req.query;
  cohnsole.log(`The date: ${date} The band: ${band} The venue: ${venue}`);
  let filteredEvents = eventData;
  console.log(filteredEvents);
  if (date) {
    filteredEvents = filteredEvents.filter(event => event.date.includes(date));
  }

  if (band) {
    filteredEvents = filteredEvents.filter(event => event.band.name.toLowerCase().includes(band.toLowerCase()));
  }

  if (venue) {
    filteredEvents = filteredEvents.filter(event => event.venue.name.toLowerCase().includes(venue.toLowerCase()));
  }

  res.json(filteredEvents); // Ensure JSON response
});


// Add a new event
app.post("/api/events", (req, res) => {
  const newEvent = req.body;

  // Add a unique ID to the event if needed
  newEvent.band.id = (eventData.length + 1).toString();
  newEvent.venue.id = (eventData.length + 1).toString();

  eventData.push(newEvent);
  res.status(201).json(newEvent);
});

// Edit an event by ID
app.put("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  const eventIndex = eventData.findIndex(event => event.band.id === id);
  if (eventIndex !== -1) {
    eventData[eventIndex] = { ...eventData[eventIndex], ...updatedEvent };
    res.json(eventData[eventIndex]);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// Delete an event by ID
app.delete("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const eventIndex = eventData.findIndex(event => event.band.id === id);

  if (eventIndex !== -1) {
    const deletedEvent = eventData.splice(eventIndex, 1);
    res.json(deletedEvent);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
