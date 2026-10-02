import { Link } from 'react-router-dom';
import { formatDuration } from '../utils/helpers.js';
import './MovieCard.css';

export default function MovieCard({ movie, compact = false }) {
  return (
    <div className={`movie-card ${compact ? 'movie-card--compact' : ''}`}>
      <Link to={`/movies/${movie._id}`} className="movie-card__poster-link">
        <div className="movie-card__poster">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('movie-card__poster--fallback');
              e.target.parentElement.setAttribute('data-title', movie.title.charAt(0));
            }}
          />
          <div className="movie-card__overlay">
            {movie.rating && <span className="movie-card__rating">★ {movie.rating}</span>}
          </div>
        </div>
      </Link>
      <div className="movie-card__info">
        <Link to={`/movies/${movie._id}`} className="movie-card__title">
          {movie.title}
        </Link>
        <div className="movie-card__meta">
          <span>{movie.genre.slice(0, 2).join(', ')}</span>
          <span className="movie-card__dot">·</span>
          <span>{movie.language}</span>
        </div>
        {!compact && (
          <>
            <div className="movie-card__meta">
              <span>{formatDuration(movie.duration)}</span>
              <span className="movie-card__dot">·</span>
              <span>{movie.certification}</span>
            </div>
            {movie.status === 'now_showing' ? (
              <Link to={`/booking/${movie._id}`} className="btn btn--primary btn--sm btn--full movie-card__cta">
                Book Tickets
              </Link>
            ) : (
              <span className="badge badge--warning movie-card__badge">Coming Soon</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
