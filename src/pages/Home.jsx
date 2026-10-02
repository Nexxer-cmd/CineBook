import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import CinemaCard from '../components/CinemaCard.jsx';
import { getNowShowingMovies, getComingSoonMovies, getCinemas } from '../services/dataService.js';
import { formatDuration } from '../utils/helpers.js';
import './Home.css';

const CAROUSEL_INTERVAL = 6000; // 6 seconds per slide

export default function Home() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const ns = getNowShowingMovies();
    const cs = getComingSoonMovies();
    setNowShowing(ns);
    setComingSoon(cs);
    setCinemas(getCinemas().slice(0, 3));
    // Use top-rated now showing for carousel
    setHeroMovies(ns.filter(m => m.rating >= 7.0).slice(0, 5));
  }, []);

  // Auto-rotate carousel
  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    if (heroMovies.length === 0) return;
    goToSlide((activeSlide + 1) % heroMovies.length);
  }, [activeSlide, heroMovies.length, goToSlide]);

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    intervalRef.current = setInterval(nextSlide, CAROUSEL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [nextSlide, heroMovies.length]);

  const handleDotClick = (index) => {
    clearInterval(intervalRef.current);
    goToSlide(index);
  };

  const currentMovie = heroMovies[activeSlide];

  return (
    <div className="page">
      {/* Hero Carousel */}
      {currentMovie && (
        <section className="hero">
          {heroMovies.map((movie, index) => (
            <div
              key={movie._id}
              className={`hero__slide ${index === activeSlide ? 'hero__slide--active' : ''}`}
            >
              <div className="hero__backdrop">
                <img src={movie.backdrop} alt={movie.title} />
                <div className="hero__gradient" />
              </div>
            </div>
          ))}

          <div className="hero__content container">
            <div className="hero__info" key={currentMovie._id}>
              <div className="hero__badges">
                {currentMovie.genre.map(g => (
                  <span key={g} className="badge">{g}</span>
                ))}
                {currentMovie.rating && <span className="badge badge--accent">★ {currentMovie.rating}</span>}
              </div>
              <h1 className="hero__title">{currentMovie.title}</h1>
              <p className="hero__meta">
                {currentMovie.language} · {formatDuration(currentMovie.duration)} · {currentMovie.certification}
              </p>
              <p className="hero__description">{currentMovie.description}</p>
              <div className="hero__actions">
                <Link to={`/booking/${currentMovie._id}`} className="btn btn--primary btn--lg">
                  Book Tickets
                </Link>
                <Link to={`/movies/${currentMovie._id}`} className="btn btn--secondary btn--lg">
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          {heroMovies.length > 1 && (
            <div className="hero__dots">
              {heroMovies.map((_, index) => (
                <button
                  key={index}
                  className={`hero__dot ${index === activeSlide ? 'hero__dot--active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}


        </section>
      )}

      {/* Now Showing */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Now Showing</h2>
            <Link to="/movies?status=now_showing" className="section__link">View All →</Link>
          </div>
          <div className="hscroll">
            {nowShowing.map(movie => (
              <MovieCard key={movie._id} movie={movie} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__header">
              <h2 className="section__title">Coming Soon</h2>
              <Link to="/movies?status=coming_soon" className="section__link">View All →</Link>
            </div>
            <div className="hscroll">
              {comingSoon.map(movie => (
                <MovieCard key={movie._id} movie={movie} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Movies */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Popular Movies</h2>
            <Link to="/movies" className="section__link">Browse All →</Link>
          </div>
          <div className="grid grid--4">
            {nowShowing.slice(0, 4).map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Cinemas */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Popular Cinemas</h2>
            <Link to="/cinemas" className="section__link">View All →</Link>
          </div>
          <div className="grid grid--3">
            {cinemas.map(cinema => (
              <CinemaCard key={cinema._id} cinema={cinema} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner__content">
              <h3>Get 20% off on your first booking</h3>
              <p>Sign up today and enjoy discounted tickets on your first movie booking. Limited time offer.</p>
              <Link to="/login" className="btn btn--primary">Sign Up Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
