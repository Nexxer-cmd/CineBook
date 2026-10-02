import { Link } from 'react-router-dom';
import './CinemaCard.css';

export default function CinemaCard({ cinema }) {
  return (
    <div className="cinema-card">
      <div className="cinema-card__header">
        <h3 className="cinema-card__name">{cinema.name}</h3>
        <span className="cinema-card__location">{cinema.location}</span>
      </div>
      <p className="cinema-card__address">{cinema.address}</p>
      <div className="cinema-card__screens">
        <span className="cinema-card__screen-count">
          {cinema.screens.length} {cinema.screens.length === 1 ? 'Screen' : 'Screens'}
        </span>
      </div>
      <div className="cinema-card__facilities">
        {cinema.facilities.slice(0, 4).map(f => (
          <span key={f} className="badge">{f}</span>
        ))}
        {cinema.facilities.length > 4 && (
          <span className="badge">+{cinema.facilities.length - 4}</span>
        )}
      </div>
      <Link to={`/cinemas/${cinema._id}`} className="btn btn--secondary btn--sm cinema-card__cta">
        View Shows
      </Link>
    </div>
  );
}
