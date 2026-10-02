import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, getShowsForMovie, getCinemaById } from '../services/dataService.js';
import { formatDuration, formatDateFull } from '../utils/helpers.js';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showCinemas, setShowCinemas] = useState([]);

  useEffect(() => {
    const m = getMovieById(id);
    if (m) {
      setMovie(m);
      // Get unique cinemas with shows
      const shows = getShowsForMovie(id);
      const cinemaIds = [...new Set(shows.map(s => s.cinemaId))];
      const cinemaList = cinemaIds.map(cId => {
        const cinema = getCinemaById(cId);
        const cinemaShows = shows.filter(s => s.cinemaId === cId);
        return { ...cinema, shows: cinemaShows };
      }).filter(Boolean);
      setShowCinemas(cinemaList);
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">🎬</div>
            <h3 className="empty-state__title">Movie not found</h3>
            <p className="empty-state__text">The movie you're looking for doesn't exist.</p>
            <Link to="/movies" className="btn btn--secondary" style={{ marginTop: '16px' }}>Browse Movies</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Backdrop */}
      <div className="movie-detail__backdrop">
        <img src={movie.backdrop} alt={movie.title} />
        <div className="movie-detail__backdrop-gradient" />
      </div>

      <div className="container">
        <div className="movie-detail__header">
          <div className="movie-detail__poster">
            <img src={movie.poster} alt={`${movie.title} poster`} />
          </div>
          <div className="movie-detail__info">
            <div className="movie-detail__badges">
              {movie.genre.map(g => (
                <span key={g} className="badge">{g}</span>
              ))}
              {movie.rating && <span className="badge badge--accent">★ {movie.rating}</span>}
            </div>
            <h1 className="movie-detail__title">{movie.title}</h1>
            <div className="movie-detail__meta">
              <span>{movie.language}</span>
              <span className="movie-detail__dot">·</span>
              <span>{formatDuration(movie.duration)}</span>
              <span className="movie-detail__dot">·</span>
              <span>{movie.certification}</span>
              <span className="movie-detail__dot">·</span>
              <span>{formatDateFull(movie.releaseDate)}</span>
            </div>
            <p className="movie-detail__description">{movie.description}</p>

            {movie.formats && (
              <div className="movie-detail__formats">
                <span className="movie-detail__label">Available in</span>
                <div className="movie-detail__format-list">
                  {movie.formats.map(f => (
                    <span key={f} className="badge">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="movie-detail__actions">
              {movie.status === 'now_showing' ? (
                <Link to={`/booking/${movie._id}`} className="btn btn--primary btn--lg">
                  Book Tickets
                </Link>
              ) : (
                <span className="badge badge--warning" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                  Coming Soon — {formatDateFull(movie.releaseDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cast & Crew */}
        <section className="movie-detail__section">
          <h2 className="section__title">Cast & Crew</h2>
          <div className="movie-detail__crew">
            <div className="crew-item">
              <span className="crew-item__role">Director</span>
              <span className="crew-item__name">{movie.director}</span>
            </div>
            {movie.cast.map(actor => (
              <div key={actor} className="crew-item">
                <span className="crew-item__role">Cast</span>
                <span className="crew-item__name">{actor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Available at cinemas */}
        {showCinemas.length > 0 && (
          <section className="movie-detail__section">
            <h2 className="section__title">Available at</h2>
            <div className="movie-detail__cinemas">
              {showCinemas.map(cinema => (
                <div key={cinema._id} className="available-cinema">
                  <div className="available-cinema__info">
                    <h4>{cinema.name}</h4>
                    <span className="available-cinema__location">{cinema.location} · {cinema.address}</span>
                  </div>
                  <Link to={`/booking/${movie._id}`} className="btn btn--secondary btn--sm">
                    View Shows
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
