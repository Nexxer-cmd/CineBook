import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  getMovies, addMovie, updateMovie, deleteMovie,
  getCinemas, addCinema,
  getShows, addShow, updateShow,
  getBookings, getAllUsers
} from '../services/dataService.js';
import { formatCurrency, formatDateFull } from '../utils/helpers.js';
import './Admin.css';

const TABS = ['Movies', 'Cinemas', 'Shows', 'Bookings', 'Users'];

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Movies');
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    refreshData();
  }, [user, isAdmin, navigate]);

  const refreshData = () => {
    setMovies(getMovies());
    setCinemas(getCinemas());
    setShows(getShows());
    setBookings(getBookings());
    setUsers(getAllUsers());
  };

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: '', description: '', poster: '', backdrop: '',
    genre: '', language: 'English', duration: '',
    rating: '', certification: 'UA', releaseDate: '',
    cast: '', director: '', status: 'now_showing', formats: '2D'
  });

  const handleMovieFormChange = (e) => {
    const { name, value } = e.target;
    setMovieForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.description) {
      addToast('Title and description are required', 'warning');
      return;
    }

    const movieData = {
      ...movieForm,
      genre: movieForm.genre.split(',').map(g => g.trim()).filter(Boolean),
      cast: movieForm.cast.split(',').map(c => c.trim()).filter(Boolean),
      formats: movieForm.formats.split(',').map(f => f.trim()).filter(Boolean),
      duration: parseInt(movieForm.duration) || 120,
      rating: parseFloat(movieForm.rating) || 7.0
    };

    if (editingItem) {
      updateMovie(editingItem._id, movieData);
      addToast('Movie updated', 'success');
    } else {
      addMovie(movieData);
      addToast('Movie added', 'success');
    }

    setShowForm(false);
    setEditingItem(null);
    setMovieForm({
      title: '', description: '', poster: '', backdrop: '',
      genre: '', language: 'English', duration: '',
      rating: '', certification: 'UA', releaseDate: '',
      cast: '', director: '', status: 'now_showing', formats: '2D'
    });
    refreshData();
  };

  const handleEditMovie = (movie) => {
    setEditingItem(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      backdrop: movie.backdrop,
      genre: movie.genre.join(', '),
      language: movie.language,
      duration: String(movie.duration),
      rating: String(movie.rating),
      certification: movie.certification,
      releaseDate: movie.releaseDate,
      cast: movie.cast.join(', '),
      director: movie.director,
      status: movie.status,
      formats: (movie.formats || ['2D']).join(', ')
    });
    setShowForm(true);
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id);
      addToast('Movie deleted', 'success');
      refreshData();
    }
  };

  // Show form state
  const [showFormData, setShowFormData] = useState({
    movieId: '', cinemaId: '', date: '', time: '', format: '2D', language: 'English'
  });

  const handleAddShow = (e) => {
    e.preventDefault();
    if (!showFormData.movieId || !showFormData.cinemaId || !showFormData.date || !showFormData.time) {
      addToast('All fields are required', 'warning');
      return;
    }
    const cinema = getCinemas().find(c => c._id === showFormData.cinemaId);
    const screenId = cinema?.screens?.[0]?._id || '';

    addShow({
      ...showFormData,
      screenId,
      prices: {
        premium: { '2D': 350, '3D': 450, 'IMAX': 550 },
        standard: { '2D': 250, '3D': 320, 'IMAX': 420 },
        economy: { '2D': 150, '3D': 200, 'IMAX': 280 }
      }
    });
    addToast('Show created', 'success');
    setShowFormData({ movieId: '', cinemaId: '', date: '', time: '', format: '2D', language: 'English' });
    refreshData();
  };

  // Cinema form state
  const [cinemaForm, setCinemaForm] = useState({
    name: '', location: '', address: '', facilities: ''
  });

  const handleAddCinema = (e) => {
    e.preventDefault();
    if (!cinemaForm.name || !cinemaForm.location) {
      addToast('Name and location are required', 'warning');
      return;
    }
    addCinema({
      ...cinemaForm,
      facilities: cinemaForm.facilities.split(',').map(f => f.trim()).filter(Boolean),
      screens: [{
        _id: 'sc' + Date.now(),
        name: 'Screen 1',
        rows: 8,
        seatsPerRow: 10,
        seatTypes: { premium: ['A', 'B'], standard: ['C', 'D', 'E', 'F'], economy: ['G', 'H'] }
      }]
    });
    addToast('Cinema added', 'success');
    setCinemaForm({ name: '', location: '', address: '', facilities: '' });
    refreshData();
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Admin Panel</h1>
          <p className="page__subtitle">Manage movies, cinemas, shows, and bookings</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
              onClick={() => { setActiveTab(tab); setShowForm(false); setEditingItem(null); }}
            >
              {tab}
              <span className="admin-tab__count">
                {tab === 'Movies' ? movies.length :
                 tab === 'Cinemas' ? cinemas.length :
                 tab === 'Shows' ? shows.length :
                 tab === 'Bookings' ? bookings.length :
                 users.length}
              </span>
            </button>
          ))}
        </div>

        {/* Movies Tab */}
        {activeTab === 'Movies' && (
          <div className="admin-content">
            <div className="admin-content__header">
              <h3>Movies ({movies.length})</h3>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => { setShowForm(!showForm); setEditingItem(null); }}
              >
                {showForm ? 'Cancel' : 'Add Movie'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleAddMovie}>
                <div className="admin-form__grid">
                  <div className="input-group">
                    <label>Title *</label>
                    <input className="input" name="title" value={movieForm.title} onChange={handleMovieFormChange} required />
                  </div>
                  <div className="input-group">
                    <label>Director</label>
                    <input className="input" name="director" value={movieForm.director} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group">
                    <label>Genre (comma separated)</label>
                    <input className="input" name="genre" value={movieForm.genre} onChange={handleMovieFormChange} placeholder="Drama, Thriller" />
                  </div>
                  <div className="input-group">
                    <label>Language</label>
                    <select className="input" name="language" value={movieForm.language} onChange={handleMovieFormChange}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Duration (minutes)</label>
                    <input className="input" name="duration" type="number" value={movieForm.duration} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group">
                    <label>Rating</label>
                    <input className="input" name="rating" type="number" step="0.1" min="0" max="10" value={movieForm.rating} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group">
                    <label>Certification</label>
                    <select className="input" name="certification" value={movieForm.certification} onChange={handleMovieFormChange}>
                      <option>U</option>
                      <option>UA</option>
                      <option>A</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Release Date</label>
                    <input className="input" name="releaseDate" type="date" value={movieForm.releaseDate} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group">
                    <label>Status</label>
                    <select className="input" name="status" value={movieForm.status} onChange={handleMovieFormChange}>
                      <option value="now_showing">Now Showing</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Formats (comma separated)</label>
                    <input className="input" name="formats" value={movieForm.formats} onChange={handleMovieFormChange} placeholder="2D, 3D, IMAX" />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Cast (comma separated)</label>
                    <input className="input" name="cast" value={movieForm.cast} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Description *</label>
                    <textarea className="input admin-form__textarea" name="description" value={movieForm.description} onChange={handleMovieFormChange} rows="3" required />
                  </div>
                  <div className="input-group">
                    <label>Poster URL</label>
                    <input className="input" name="poster" value={movieForm.poster} onChange={handleMovieFormChange} />
                  </div>
                  <div className="input-group">
                    <label>Backdrop URL</label>
                    <input className="input" name="backdrop" value={movieForm.backdrop} onChange={handleMovieFormChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">
                  {editingItem ? 'Update Movie' : 'Add Movie'}
                </button>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Language</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie._id}>
                      <td className="admin-table__title">{movie.title}</td>
                      <td>{movie.genre.join(', ')}</td>
                      <td>{movie.language}</td>
                      <td>★ {movie.rating}</td>
                      <td>
                        <span className={`badge ${movie.status === 'now_showing' ? 'badge--success' : 'badge--warning'}`}>
                          {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                        </span>
                      </td>
                      <td className="admin-table__actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => handleEditMovie(movie)}>Edit</button>
                        <button className="btn btn--ghost btn--sm" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cinemas Tab */}
        {activeTab === 'Cinemas' && (
          <div className="admin-content">
            <div className="admin-content__header">
              <h3>Cinemas ({cinemas.length})</h3>
              <button className="btn btn--primary btn--sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Cinema'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleAddCinema}>
                <div className="admin-form__grid">
                  <div className="input-group">
                    <label>Name *</label>
                    <input className="input" value={cinemaForm.name} onChange={(e) => setCinemaForm({ ...cinemaForm, name: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label>Location *</label>
                    <input className="input" value={cinemaForm.location} onChange={(e) => setCinemaForm({ ...cinemaForm, location: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Address</label>
                    <input className="input" value={cinemaForm.address} onChange={(e) => setCinemaForm({ ...cinemaForm, address: e.target.value })} />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Facilities (comma separated)</label>
                    <input className="input" value={cinemaForm.facilities} onChange={(e) => setCinemaForm({ ...cinemaForm, facilities: e.target.value })} placeholder="Parking, Food Court, IMAX" />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">Add Cinema</button>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Screens</th>
                    <th>Facilities</th>
                  </tr>
                </thead>
                <tbody>
                  {cinemas.map(cinema => (
                    <tr key={cinema._id}>
                      <td className="admin-table__title">{cinema.name}</td>
                      <td>{cinema.location}</td>
                      <td>{cinema.screens.length}</td>
                      <td>{cinema.facilities.slice(0, 3).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shows Tab */}
        {activeTab === 'Shows' && (
          <div className="admin-content">
            <div className="admin-content__header">
              <h3>Shows ({shows.length})</h3>
              <button className="btn btn--primary btn--sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Create Show'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleAddShow}>
                <div className="admin-form__grid">
                  <div className="input-group">
                    <label>Movie *</label>
                    <select className="input" value={showFormData.movieId} onChange={(e) => setShowFormData({ ...showFormData, movieId: e.target.value })} required>
                      <option value="">Select Movie</option>
                      {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Cinema *</label>
                    <select className="input" value={showFormData.cinemaId} onChange={(e) => setShowFormData({ ...showFormData, cinemaId: e.target.value })} required>
                      <option value="">Select Cinema</option>
                      {cinemas.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Date *</label>
                    <input className="input" type="date" value={showFormData.date} onChange={(e) => setShowFormData({ ...showFormData, date: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label>Time *</label>
                    <input className="input" value={showFormData.time} onChange={(e) => setShowFormData({ ...showFormData, time: e.target.value })} placeholder="10:30 AM" required />
                  </div>
                  <div className="input-group">
                    <label>Format</label>
                    <select className="input" value={showFormData.format} onChange={(e) => setShowFormData({ ...showFormData, format: e.target.value })}>
                      <option>2D</option>
                      <option>3D</option>
                      <option>IMAX</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Language</label>
                    <select className="input" value={showFormData.language} onChange={(e) => setShowFormData({ ...showFormData, language: e.target.value })}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">Create Show</button>
              </form>
            )}

            <p className="admin-content__info">Showing latest 20 shows</p>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Cinema</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Format</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.slice(0, 20).map(show => {
                    const movie = movies.find(m => m._id === show.movieId);
                    const cinema = cinemas.find(c => c._id === show.cinemaId);
                    return (
                      <tr key={show._id}>
                        <td>{movie?.title || show.movieId}</td>
                        <td>{cinema?.name || show.cinemaId}</td>
                        <td>{show.date}</td>
                        <td>{show.time}</td>
                        <td><span className="badge">{show.format}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'Bookings' && (
          <div className="admin-content">
            <div className="admin-content__header">
              <h3>Bookings ({bookings.length})</h3>
            </div>
            {bookings.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Movie</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => {
                      const movie = movies.find(m => m._id === booking.movieId);
                      const bookingUser = users.find(u => u._id === booking.userId);
                      return (
                        <tr key={booking._id}>
                          <td className="admin-table__mono">{booking._id}</td>
                          <td>{bookingUser?.name || booking.userId}</td>
                          <td>{movie?.title || booking.movieId}</td>
                          <td>{booking.seats?.join(', ')}</td>
                          <td>{formatCurrency(booking.amount)}</td>
                          <td>
                            <span className="badge badge--success">{booking.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-state__text">No bookings yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'Users' && (
          <div className="admin-content">
            <div className="admin-content__header">
              <h3>Users ({users.length})</h3>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td className="admin-table__title">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge--accent' : ''}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
