// Local storage data service for CineBook
// Handles all data operations using browser storage

const DATA_VERSION = '8.0';
import moviesData from '../data/movies.js';
import cinemasData from '../data/cinemas.js';
import showsData from '../data/shows.js';
import usersData from '../data/users.js';

const STORAGE_KEYS = {
  MOVIES: 'cinebook_movies',
  CINEMAS: 'cinebook_cinemas',
  SHOWS: 'cinebook_shows',
  USERS: 'cinebook_users',
  BOOKINGS: 'cinebook_bookings',
  CURRENT_USER: 'cinebook_current_user',
  BOOKED_SEATS: 'cinebook_booked_seats'
};

// Initialize data — refresh if version changed
function initializeData() {
  const storedVersion = localStorage.getItem('cinebook_version');
  const needsRefresh = storedVersion !== DATA_VERSION;

  if (needsRefresh || !localStorage.getItem(STORAGE_KEYS.MOVIES)) {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(moviesData));
  }
  if (needsRefresh || !localStorage.getItem(STORAGE_KEYS.CINEMAS)) {
    localStorage.setItem(STORAGE_KEYS.CINEMAS, JSON.stringify(cinemasData));
  }
  if (needsRefresh || !localStorage.getItem(STORAGE_KEYS.SHOWS)) {
    localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(showsData));
  }
  if (needsRefresh || !localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKED_SEATS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKED_SEATS, JSON.stringify({}));
  }

  if (needsRefresh) {
    localStorage.setItem('cinebook_version', DATA_VERSION);
  }
}

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== MOVIES =====

export function getMovies() {
  return getData(STORAGE_KEYS.MOVIES) || [];
}

export function getMovieById(id) {
  const movies = getMovies();
  return movies.find(m => m._id === id) || null;
}

export function getNowShowingMovies() {
  return getMovies().filter(m => m.status === 'now_showing');
}

export function getComingSoonMovies() {
  return getMovies().filter(m => m.status === 'coming_soon');
}

export function searchMovies(query) {
  const q = query.toLowerCase();
  return getMovies().filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genre.some(g => g.toLowerCase().includes(q)) ||
    m.language.toLowerCase().includes(q)
  );
}

export function addMovie(movie) {
  const movies = getMovies();
  movie._id = 'm' + Date.now();
  movies.push(movie);
  setData(STORAGE_KEYS.MOVIES, movies);
  return movie;
}

export function updateMovie(id, updates) {
  const movies = getMovies();
  const idx = movies.findIndex(m => m._id === id);
  if (idx !== -1) {
    movies[idx] = { ...movies[idx], ...updates };
    setData(STORAGE_KEYS.MOVIES, movies);
    return movies[idx];
  }
  return null;
}

export function deleteMovie(id) {
  const movies = getMovies().filter(m => m._id !== id);
  setData(STORAGE_KEYS.MOVIES, movies);
}

// ===== CINEMAS =====

export function getCinemas() {
  return getData(STORAGE_KEYS.CINEMAS) || [];
}

export function getCinemaById(id) {
  return getCinemas().find(c => c._id === id) || null;
}

export function searchCinemas(query) {
  const q = query.toLowerCase();
  return getCinemas().filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q) ||
    c.address.toLowerCase().includes(q)
  );
}

export function addCinema(cinema) {
  const cinemas = getCinemas();
  cinema._id = 'c' + Date.now();
  cinema.screens = cinema.screens || [];
  cinemas.push(cinema);
  setData(STORAGE_KEYS.CINEMAS, cinemas);
  return cinema;
}

// ===== SHOWS =====

export function getShows() {
  return getData(STORAGE_KEYS.SHOWS) || [];
}

export function getShowById(id) {
  return getShows().find(s => s._id === id) || null;
}

export function getShowsForMovie(movieId) {
  return getShows().filter(s => s.movieId === movieId);
}

export function getShowsForCinema(cinemaId) {
  return getShows().filter(s => s.cinemaId === cinemaId);
}

export function getShowsForMovieAndDate(movieId, date) {
  return getShows().filter(s => s.movieId === movieId && s.date === date);
}

export function addShow(show) {
  const shows = getShows();
  show._id = 'sh' + Date.now();
  shows.push(show);
  setData(STORAGE_KEYS.SHOWS, shows);
  return show;
}

export function updateShow(id, updates) {
  const shows = getShows();
  const idx = shows.findIndex(s => s._id === id);
  if (idx !== -1) {
    shows[idx] = { ...shows[idx], ...updates };
    setData(STORAGE_KEYS.SHOWS, shows);
    return shows[idx];
  }
  return null;
}

// ===== SEATS =====

export function getBookedSeats(showId) {
  const allBooked = getData(STORAGE_KEYS.BOOKED_SEATS) || {};
  return allBooked[showId] || [];
}

export function bookSeats(showId, seats) {
  const allBooked = getData(STORAGE_KEYS.BOOKED_SEATS) || {};
  if (!allBooked[showId]) allBooked[showId] = [];
  allBooked[showId] = [...allBooked[showId], ...seats];
  setData(STORAGE_KEYS.BOOKED_SEATS, allBooked);
}

// ===== BOOKINGS =====

export function getBookings() {
  return getData(STORAGE_KEYS.BOOKINGS) || [];
}

export function getUserBookings(userId) {
  return getBookings().filter(b => b.userId === userId);
}

export function getBookingById(id) {
  return getBookings().find(b => b._id === id) || null;
}

export function createBooking(booking) {
  const bookings = getBookings();
  booking.bookingDate = new Date().toISOString();
  booking.status = 'confirmed';
  bookings.push(booking);
  setData(STORAGE_KEYS.BOOKINGS, bookings);

  // Mark seats as booked
  bookSeats(booking.showId, booking.seats);

  return booking;
}

// ===== AUTH =====

export function login(email, password) {
  const users = getData(STORAGE_KEYS.USERS) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    setData(STORAGE_KEYS.CURRENT_USER, safeUser);
    return safeUser;
  }
  return null;
}

export function register(userData) {
  const users = getData(STORAGE_KEYS.USERS) || [];
  const exists = users.find(u => u.email === userData.email);
  if (exists) return { error: 'Email already registered' };

  const newUser = {
    _id: 'u' + Date.now(),
    ...userData,
    role: 'user',
    createdAt: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  setData(STORAGE_KEYS.USERS, users);

  const { password: _, ...safeUser } = newUser;
  setData(STORAGE_KEYS.CURRENT_USER, safeUser);
  return safeUser;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser() {
  return getData(STORAGE_KEYS.CURRENT_USER);
}

export function getAllUsers() {
  const users = getData(STORAGE_KEYS.USERS) || [];
  return users.map(({ password, ...u }) => u);
}

// ===== INIT =====

export { initializeData };
