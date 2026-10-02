import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCinemaById, getShowsForCinema, getMovieById } from '../services/dataService.js';
import './CinemaDetail.css';

export default function CinemaDetail() {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [movieShows, setMovieShows] = useState([]);

  useEffect(() => {
    const c = getCinemaById(id);
    if (c) {
      setCinema(c);
      const shows = getShowsForCinema(id);
      // Group shows by movie
      const movieMap = {};
      shows.forEach(show => {
        if (!movieMap[show.movieId]) {
          const movie = getMovieById(show.movieId);
          if (movie) {
            movieMap[show.movieId] = { movie, shows: [] };
          }
        }
        if (movieMap[show.movieId]) {
          movieMap[show.movieId].shows.push(show);
        }
      });
      setMovieShows(Object.values(movieMap));
    }
  }, [id]);

  if (!cinema) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">🏛️</div>
            <h3 className="empty-state__title">Cinema not found</h3>
            <Link to="/cinemas" className="btn btn--secondary" style={{ marginTop: '16px' }}>Browse Cinemas</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">{cinema.name}</h1>
          <p className="page__subtitle">{cinema.location} · {cinema.address}</p>
        </div>

        <div className="cinema-info">
          <div className="cinema-info__item">
            <span className="cinema-info__label">Screens</span>
            <div className="cinema-info__screens">
              {cinema.screens.map(s => (
                <span key={s._id} className="badge">{s.name}</span>
              ))}
            </div>
          </div>
          <div className="cinema-info__item">
            <span className="cinema-info__label">Facilities</span>
            <div className="cinema-info__facilities">
              {cinema.facilities.map(f => (
                <span key={f} className="badge">{f}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="cinema-movies">
          <h2 className="section__title">Now Showing</h2>
          {movieShows.length > 0 ? (
            <div className="cinema-movies__list">
              {movieShows.map(({ movie, shows }) => (
                <div key={movie._id} className="cinema-movie-item">
                  <div className="cinema-movie-item__poster">
                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                  </div>
                  <div className="cinema-movie-item__info">
                    <Link to={`/movies/${movie._id}`} className="cinema-movie-item__title">
                      {movie.title}
                    </Link>
                    <span className="cinema-movie-item__meta">
                      {movie.genre.join(', ')} · {movie.language} · {movie.certification}
                    </span>
                    <div className="cinema-movie-item__shows">
                      {shows.slice(0, 6).map(show => (
                        <Link
                          key={show._id}
                          to={`/booking/${movie._id}`}
                          className="show-time"
                        >
                          <span className="show-time__time">{show.time}</span>
                          <span className="show-time__meta">{show.format}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state__text">No movies currently showing at this cinema.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
