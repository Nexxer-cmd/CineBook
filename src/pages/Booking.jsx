import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMovieById, getCinemas, getShowsForMovieAndDate,
  getCinemaById, createBooking
} from '../services/dataService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SeatMap from '../components/SeatMap.jsx';
import {
  getDateRange, formatCurrency, formatDuration,
  formatDateFull, generateBookingId
} from '../utils/helpers.js';
import './Booking.css';

const STEPS = ['select-date', 'select-show', 'select-seats', 'summary', 'confirmed'];

export default function Booking() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [step, setStep] = useState('select-date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const dates = useMemo(() => getDateRange(7), []);

  useEffect(() => {
    const m = getMovieById(movieId);
    if (!m) {
      navigate('/movies');
      return;
    }
    setMovie(m);
    setSelectedDate(dates[0].date);
  }, [movieId, navigate, dates]);

  // Shows grouped by cinema for selected date
  const showsByCinema = useMemo(() => {
    if (!selectedDate || !movie) return [];
    const shows = getShowsForMovieAndDate(movie._id, selectedDate);
    const grouped = {};

    shows.forEach(show => {
      if (!grouped[show.cinemaId]) {
        const cinema = getCinemaById(show.cinemaId);
        grouped[show.cinemaId] = { cinema, shows: [] };
      }
      grouped[show.cinemaId].shows.push(show);
    });

    return Object.values(grouped);
  }, [selectedDate, movie]);

  // Selected cinema's screen
  const selectedScreen = useMemo(() => {
    if (!selectedShow) return null;
    const cinema = getCinemaById(selectedShow.cinemaId);
    return cinema?.screens?.find(s => s._id === selectedShow.screenId) || cinema?.screens?.[0] || null;
  }, [selectedShow]);

  // Price calculation
  const priceBreakdown = useMemo(() => {
    if (!selectedSeats.length || !selectedShow) return null;
    let ticketTotal = 0;
    selectedSeats.forEach(seat => {
      const price = selectedShow.prices?.[seat.type]?.[selectedShow.format] || 250;
      ticketTotal += price;
    });
    const convenienceFee = selectedSeats.length * 30;
    const tax = Math.round((ticketTotal + convenienceFee) * 0.18);
    const total = ticketTotal + convenienceFee + tax;
    return { ticketTotal, convenienceFee, tax, total };
  }, [selectedSeats, selectedShow]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedShow(null);
    setSelectedSeats([]);
    setStep('select-date');
  };

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
    setStep('select-seats');
  };

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleProceedToSummary = () => {
    if (selectedSeats.length === 0) {
      addToast('Please select at least one seat', 'warning');
      return;
    }
    setStep('summary');
  };

  const handleConfirmBooking = () => {
    if (!user) {
      addToast('Please login to book tickets', 'warning');
      navigate('/login');
      return;
    }

    const bookingId = generateBookingId();
    const booking = {
      _id: bookingId,
      userId: user._id,
      movieId: movie._id,
      showId: selectedShow._id,
      cinemaId: selectedShow.cinemaId,
      date: selectedDate,
      time: selectedShow.time,
      format: selectedShow.format,
      language: selectedShow.language,
      seats: selectedSeats.map(s => s.label),
      seatDetails: selectedSeats,
      amount: priceBreakdown.total,
      ticketTotal: priceBreakdown.ticketTotal,
      convenienceFee: priceBreakdown.convenienceFee,
      tax: priceBreakdown.tax
    };

    const created = createBooking(booking);
    setConfirmedBooking(created);
    setStep('confirmed');
    addToast('Booking confirmed!', 'success');
  };

  if (!movie) return null;

  const cinema = selectedShow ? getCinemaById(selectedShow.cinemaId) : null;

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="booking__breadcrumb">
          <span className="booking__movie-name">{movie.title}</span>
          <span className="booking__movie-meta">
            {movie.language} · {formatDuration(movie.duration)} · {movie.certification}
          </span>
        </div>

        {step !== 'confirmed' && (
          <>
            {/* Progress */}
            <div className="booking__progress">
              {['Date', 'Show', 'Seats', 'Summary'].map((label, i) => {
                const stepKeys = ['select-date', 'select-show', 'select-seats', 'summary'];
                const isActive = STEPS.indexOf(step) >= i;
                return (
                  <div key={label} className={`booking__step ${isActive ? 'booking__step--active' : ''}`}>
                    <span className="booking__step-num">{i + 1}</span>
                    <span className="booking__step-label">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Date Selection */}
            <section className="booking__section">
              <h3 className="booking__section-title">Select Date</h3>
              <div className="date-selector">
                {dates.map(d => (
                  <button
                    key={d.date}
                    className={`date-item ${selectedDate === d.date ? 'date-item--active' : ''}`}
                    onClick={() => handleSelectDate(d.date)}
                  >
                    <span className="date-item__day">{d.day}</span>
                    <span className="date-item__num">{d.dayNum}</span>
                    <span className="date-item__month">{d.month}</span>
                    {d.isToday && <span className="date-item__today">Today</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* Show Selection */}
            {selectedDate && (
              <section className="booking__section">
                <h3 className="booking__section-title">Select Show</h3>
                {showsByCinema.length > 0 ? (
                  <div className="shows-list">
                    {showsByCinema.map(({ cinema: c, shows }) => (
                      <div key={c._id} className="cinema-shows">
                        <div className="cinema-shows__header">
                          <div>
                            <h4 className="cinema-shows__name">{c.name}</h4>
                            <span className="cinema-shows__location">{c.location}</span>
                          </div>
                        </div>
                        <div className="cinema-shows__times">
                          {shows.map(show => (
                            <button
                              key={show._id}
                              className={`show-time ${selectedShow?._id === show._id ? 'show-time--active' : ''}`}
                              onClick={() => handleSelectShow(show)}
                            >
                              <span className="show-time__time">{show.time}</span>
                              <span className="show-time__meta">{show.format} · {show.language}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="empty-state__text">No shows available for this date.</p>
                  </div>
                )}
              </section>
            )}

            {/* Seat Selection */}
            {step === 'select-seats' && selectedScreen && selectedShow && (
              <section className="booking__section">
                <h3 className="booking__section-title">Select Seats</h3>
                <div className="booking__screen-name">
                  {cinema?.name} — {selectedScreen.name}
                </div>
                <SeatMap
                  screen={selectedScreen}
                  show={selectedShow}
                  onSelectionChange={handleSeatSelection}
                />
                {selectedSeats.length > 0 && (
                  <div className="booking__seat-actions">
                    <div className="booking__seat-price">
                      <span>{selectedSeats.length} ticket{selectedSeats.length > 1 ? 's' : ''}</span>
                      <span className="booking__seat-total">{formatCurrency(priceBreakdown.ticketTotal)}</span>
                    </div>
                    <button className="btn btn--primary" onClick={handleProceedToSummary}>
                      Continue
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Booking Summary */}
            {step === 'summary' && priceBreakdown && (
              <section className="booking__section">
                <h3 className="booking__section-title">Booking Summary</h3>
                <div className="booking-summary">
                  <div className="booking-summary__details">
                    <div className="summary-row">
                      <span className="summary-label">Movie</span>
                      <span className="summary-value">{movie.title}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Cinema</span>
                      <span className="summary-value">{cinema?.name}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Date</span>
                      <span className="summary-value">{formatDateFull(selectedDate)}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Time</span>
                      <span className="summary-value">{selectedShow.time} ({selectedShow.format})</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Seats</span>
                      <span className="summary-value">{selectedSeats.map(s => s.label).join(', ')}</span>
                    </div>
                  </div>

                  <div className="booking-summary__pricing">
                    <div className="summary-row">
                      <span className="summary-label">Tickets ({selectedSeats.length})</span>
                      <span className="summary-value">{formatCurrency(priceBreakdown.ticketTotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Convenience Fee</span>
                      <span className="summary-value">{formatCurrency(priceBreakdown.convenienceFee)}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Taxes (GST 18%)</span>
                      <span className="summary-value">{formatCurrency(priceBreakdown.tax)}</span>
                    </div>
                    <div className="summary-row summary-row--total">
                      <span className="summary-label">Total</span>
                      <span className="summary-value">{formatCurrency(priceBreakdown.total)}</span>
                    </div>
                  </div>

                  <div className="booking-summary__actions">
                    <button className="btn btn--secondary" onClick={() => setStep('select-seats')}>
                      Back
                    </button>
                    <button className="btn btn--primary btn--lg" onClick={handleConfirmBooking}>
                      {user ? 'Confirm Booking' : 'Login to Book'}
                    </button>
                  </div>

                  <p className="booking-summary__note">
                    By confirming, you agree to CineBook's terms and conditions. Tickets are non-refundable once confirmed.
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Confirmation */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="confirmation">
            <div className="confirmation__card">
              <div className="confirmation__icon">✓</div>
              <h2 className="confirmation__title">Booking Confirmed</h2>
              <p className="confirmation__id">Booking ID: {confirmedBooking._id}</p>

              <div className="confirmation__ticket">
                <div className="ticket__header">
                  <h3>{movie.title}</h3>
                  <span className="badge">{selectedShow?.format}</span>
                </div>
                <div className="ticket__grid">
                  <div className="ticket__field">
                    <span className="ticket__label">Cinema</span>
                    <span className="ticket__value">{cinema?.name}</span>
                  </div>
                  <div className="ticket__field">
                    <span className="ticket__label">Date</span>
                    <span className="ticket__value">{formatDateFull(confirmedBooking.date)}</span>
                  </div>
                  <div className="ticket__field">
                    <span className="ticket__label">Time</span>
                    <span className="ticket__value">{confirmedBooking.time}</span>
                  </div>
                  <div className="ticket__field">
                    <span className="ticket__label">Seats</span>
                    <span className="ticket__value">{confirmedBooking.seats.join(', ')}</span>
                  </div>
                </div>
                <div className="ticket__total">
                  <span>Total Paid</span>
                  <span>{formatCurrency(confirmedBooking.amount)}</span>
                </div>
              </div>

              <div className="confirmation__actions">
                <button className="btn btn--secondary" onClick={() => navigate('/bookings')}>
                  My Bookings
                </button>
                <button className="btn btn--primary" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
