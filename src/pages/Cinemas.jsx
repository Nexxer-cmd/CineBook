import { useState, useEffect, useMemo } from 'react';
import CinemaCard from '../components/CinemaCard.jsx';
import { getCinemas, searchCinemas } from '../services/dataService.js';
import './Cinemas.css';

const LOCATIONS = ['All', 'Mumbai', 'Delhi', 'Bangalore'];

export default function CinemasPage() {
  const [allCinemas, setAllCinemas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('All');

  useEffect(() => {
    setAllCinemas(getCinemas());
  }, []);

  const filtered = useMemo(() => {
    let result = searchQuery ? searchCinemas(searchQuery) : allCinemas;
    if (location !== 'All') {
      result = result.filter(c => c.location === location);
    }
    return result;
  }, [allCinemas, searchQuery, location]);

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Cinemas</h1>
          <p className="page__subtitle">Find cinemas and their show timings</p>
        </div>

        <div className="cinemas-filters">
          <input
            type="text"
            className="input cinemas-filters__search"
            placeholder="Search cinemas by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search cinemas"
          />
          <div className="filter-chips">
            {LOCATIONS.map(l => (
              <button
                key={l}
                className={`filter-chip ${location === l ? 'filter-chip--active' : ''}`}
                onClick={() => setLocation(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid--3 cinemas-grid">
            {filtered.map(cinema => (
              <CinemaCard key={cinema._id} cinema={cinema} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🏛️</div>
            <h3 className="empty-state__title">No cinemas found</h3>
            <p className="empty-state__text">Try a different search or location.</p>
          </div>
        )}
      </div>
    </div>
  );
}
