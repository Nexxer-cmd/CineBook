/**
 * CineBook — MongoDB Database Schema
 * 
 * This file documents the MongoDB collections and their structure.
 * In the current demo, data is stored in localStorage.
 * To connect to MongoDB, replace the dataService.js with actual
 * MongoDB driver operations using the schemas below.
 */

// ===== USERS COLLECTION =====
const userSchema = {
  _id: 'ObjectId',
  name: 'String (required)',
  email: 'String (required, unique)',
  phone: 'String',
  password: 'String (required, hashed in production)',
  role: 'String (user | admin)',
  createdAt: 'Date'
};

// ===== MOVIES COLLECTION =====
const movieSchema = {
  _id: 'ObjectId',
  title: 'String (required)',
  description: 'String',
  poster: 'String (URL)',
  backdrop: 'String (URL)',
  genre: 'Array<String>',
  language: 'String',
  duration: 'Number (minutes)',
  rating: 'Number (0-10)',
  certification: 'String (U | UA | A)',
  releaseDate: 'Date',
  cast: 'Array<String>',
  director: 'String',
  status: 'String (now_showing | coming_soon)',
  formats: 'Array<String> (2D, 3D, IMAX)'
};

// ===== CINEMAS COLLECTION =====
const cinemaSchema = {
  _id: 'ObjectId',
  name: 'String (required)',
  location: 'String (required)',
  address: 'String',
  screens: 'Array<Screen> (embedded)',
  facilities: 'Array<String>'
};

// ===== SCREENS (embedded in Cinema) =====
const screenSchema = {
  _id: 'ObjectId',
  cinemaId: 'ObjectId (ref: cinemas)',
  name: 'String',
  rows: 'Number',
  seatsPerRow: 'Number',
  seatTypes: {
    premium: 'Array<String> (row labels)',
    standard: 'Array<String>',
    economy: 'Array<String>'
  }
};

// ===== SHOWS COLLECTION =====
const showSchema = {
  _id: 'ObjectId',
  movieId: 'ObjectId (ref: movies)',
  cinemaId: 'ObjectId (ref: cinemas)',
  screenId: 'ObjectId (ref: screens)',
  date: 'Date',
  time: 'String (e.g., "10:30 AM")',
  language: 'String',
  format: 'String (2D | 3D | IMAX)',
  prices: {
    premium: '{ 2D: Number, 3D: Number, IMAX: Number }',
    standard: '{ 2D: Number, 3D: Number, IMAX: Number }',
    economy: '{ 2D: Number, 3D: Number, IMAX: Number }'
  }
};

// ===== BOOKINGS COLLECTION =====
const bookingSchema = {
  _id: 'String (booking ID, e.g., CBXXXXXXXX)',
  userId: 'ObjectId (ref: users)',
  showId: 'ObjectId (ref: shows)',
  movieId: 'ObjectId (ref: movies)',
  cinemaId: 'ObjectId (ref: cinemas)',
  date: 'Date',
  time: 'String',
  format: 'String',
  language: 'String',
  seats: 'Array<String> (e.g., ["A1", "A2"])',
  seatDetails: 'Array<{ label: String, type: String }>',
  amount: 'Number (total paid)',
  ticketTotal: 'Number',
  convenienceFee: 'Number',
  tax: 'Number',
  bookingDate: 'Date',
  status: 'String (confirmed | cancelled)'
};

/**
 * INDEXES (for MongoDB):
 * 
 * users: { email: 1 } (unique)
 * movies: { status: 1 }, { genre: 1 }, { language: 1 }
 * shows: { movieId: 1, date: 1 }, { cinemaId: 1, date: 1 }
 * bookings: { userId: 1 }, { showId: 1 }
 */

/**
 * RELATIONSHIPS:
 * 
 * Show → Movie (movieId)
 * Show → Cinema (cinemaId)
 * Show → Screen (screenId, embedded in Cinema)
 * Booking → User (userId)
 * Booking → Show (showId)
 * Booking → Movie (movieId)
 * Booking → Cinema (cinemaId)
 * 
 * Screen is embedded within Cinema for simplicity.
 * Seat availability is tracked per-show via the booked_seats storage.
 */

export { userSchema, movieSchema, cinemaSchema, screenSchema, showSchema, bookingSchema };
