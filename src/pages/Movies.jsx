import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import { getMovies, searchMovies } from '../services/dataService.js';
import './Movies.css';

const GENRES = ['All', 'Sci-Fi', 'Drama', 'Thriller', 'Action', 'Musical', 'Mystery', 'Fantasy', 'Adventure', 'Horror'];
const LANGUAGES = ['All', 'English', 'Hindi'];
const FORMATS = ['All', '2D', '3D', 'IMAX'];
const STATUSES = ['All', 'Now Showing', 'Coming Soon'];
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'release', label: 'Release Date' }
];

export default function MoviesPage() {
  const [searchParams] = useSearchParams();
  const [allMovies, setAllMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [status, setStatus] = useState(() => {
    const s = searchParams.get('status');
    if (s === 'now_showing') return 'Now Showing';
    if (s === 'coming_soon') return 'Coming Soon';
    return 'All';
  });
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    setAllMovies(getMovies());
  }, []);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  const filteredMovies = useMemo(() => {
    let movies = searchQuery ? searchMovies(searchQuery) : allMovies;

    if (genre !== 'All') {
      movies = movies.filter(m => m.genre.includes(genre));
    }
    if (language !== 'All') {
      movies = movies.filter(m => m.language === language);
    }
    if (format !== 'All') {
      movies = movies.filter(m => m.formats && m.formats.includes(format));
    }
    if (status !== 'All') {
      const statusKey = status === 'Now Showing' ? 'now_showing' : 'coming_soon';
      movies = movies.filter(m => m.status === statusKey);
    }

    // Sort
    movies = [...movies].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'release') return new Date(b.releaseDate) - new Date(a.releaseDate);
      return b.rating - a.rating; // default: popularity ~ rating
    });

    return movies;
  }, [allMovies, searchQuery, genre, language, format, status, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setGenre('All');
    setLanguage('All');
    setFormat('All');
    setStatus('All');
    setSortBy('popularity');
  };

  const hasFilters = searchQuery || genre !== 'All' || language !== 'All' || format !== 'All' || status !== 'All';

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Movies</h1>
          <p className="page__subtitle">Browse and book tickets for movies</p>
        </div>

        {/* Search & Filters */}
        <div className="movies-filters">
          <div className="movies-filters__search">
            <input
              type="text"
              className="input"
              placeholder="Search by name, genre, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search movies"
            />
          </div>

          <div className="movies-filters__row">
            <div className="filter-group">
              <label className="filter-group__label">Genre</label>
              <div className="filter-chips">
                {GENRES.map(g => (
                  <button
                    key={g}
                    className={`filter-chip ${genre === g ? 'filter-chip--active' : ''}`}
                    onClick={() => setGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="movies-filters__selects">
              <select
                className="input movies-filters__select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Filter by language"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>)}
              </select>

              <select
                className="input movies-filters__select"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                aria-label="Filter by format"
              >
                {FORMATS.map(f => <option key={f} value={f}>{f === 'All' ? 'All Formats' : f}</option>)}
              </select>

              <select
                className="input movies-filters__select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
              </select>

              <select
                className="input movies-filters__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>Sort: {s.label}</option>)}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="movies-filters__active">
              <span className="movies-filters__count">{filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found</span>
              <button className="btn btn--ghost btn--sm" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid--4 movies-grid">
            {filteredMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🎬</div>
            <h3 className="empty-state__title">No movies found</h3>
            <p className="empty-state__text">Try adjusting your search or filters.</p>
            <button className="btn btn--secondary" onClick={clearFilters} style={{ marginTop: '16px' }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
