import pkg from 'pg';
import { eventData } from './eventData.js';

const { Pool } = pkg;

const pool = new Pool({
  user: 'ENTER_YOUR_USERNAME_HERE',
  host: 'localhost',
  database: 'event_management',
  password: 'ENTER_YOUR_PASSWORD_HERE',
  port: 5432,
});

const insertEvents = async () => {
  try {
    for (const event of eventData) {
      const { date, time, ticketPrice, band, venue } = event;
      const bandName = band.name;
      const venueName = venue.name;
      const venueAddress = venue.address;

      await pool.query(
        'INSERT INTO events (date, time, ticketPrice, bandName, venueName, venueAddress) VALUES ($1, $2, $3, $4, $5, $6)',
        [date, time, ticketPrice, bandName, venueName, venueAddress]
      );
    }
    console.log('All events have been inserted into the database.');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    pool.end();
  }
};

insertEvents();
