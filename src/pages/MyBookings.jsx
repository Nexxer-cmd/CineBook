import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserBookings, getMovieById, getCinemaById } from '../services/dataService.js';
import { formatDateFull, formatCurrency } from '../utils/helpers.js';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userBookings = getUserBookings(user._id);
    // Enrich with movie & cinema data
    const enriched = userBookings.map(b => {
      const movie = getMovieById(b.movieId);
      const cinema = getCinemaById(b.cinemaId);
      return { ...b, movie, cinema };
    }).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    setBookings(enriched);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="page">
      <div className="container container--narrow">
        <div className="page__header">
          <h1 className="page__title">My Bookings</h1>
          <p className="page__subtitle">Your booking history</p>
        </div>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-item__poster">
                  {booking.movie && (
                    <img src={booking.movie.poster} alt={booking.movie?.title} loading="lazy" />
                  )}
                </div>
                <div className="booking-item__info">
                  <div className="booking-item__header">
                    <h3>{booking.movie?.title || 'Unknown Movie'}</h3>
                    <span className={`badge ${booking.status === 'confirmed' ? 'badge--success' : 'badge--warning'}`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                    </span>
                  </div>
                  <div className="booking-item__details">
                    <div className="booking-detail">
                      <span className="booking-detail__label">Cinema</span>
                      <span>{booking.cinema?.name || 'Unknown'}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-detail__label">Date</span>
                      <span>{formatDateFull(booking.date)}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-detail__label">Time</span>
                      <span>{booking.time} ({booking.format})</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-detail__label">Seats</span>
                      <span>{booking.seats?.join(', ')}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-detail__label">Booking ID</span>
                      <span className="booking-detail__mono">{booking._id}</span>
                    </div>
                  </div>
                  <div className="booking-item__footer">
                    <span className="booking-item__amount">{formatCurrency(booking.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🎟️</div>
            <h3 className="empty-state__title">You don't have any bookings yet</h3>
            <p className="empty-state__text">Start by browsing movies and booking tickets.</p>
            <Link to="/movies" className="btn btn--primary" style={{ marginTop: '16px' }}>
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
