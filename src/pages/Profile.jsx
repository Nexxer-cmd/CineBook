import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getUserBookings } from '../services/dataService.js';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  if (!user) {
    navigate('/login');
    return null;
  }

  const bookings = getUserBookings(user._id);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <div className="page__header">
          <h1 className="page__title">Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-card__avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-card__info">
            <h2>{user.name}</h2>
            <div className="profile-card__details">
              <div className="profile-detail">
                <span className="profile-detail__label">Email</span>
                <span className="profile-detail__value">{user.email}</span>
              </div>
              {user.phone && (
                <div className="profile-detail">
                  <span className="profile-detail__label">Phone</span>
                  <span className="profile-detail__value">{user.phone}</span>
                </div>
              )}
              <div className="profile-detail">
                <span className="profile-detail__label">Member Since</span>
                <span className="profile-detail__value">{user.createdAt}</span>
              </div>
              <div className="profile-detail">
                <span className="profile-detail__label">Total Bookings</span>
                <span className="profile-detail__value">{bookings.length}</span>
              </div>
              {user.role === 'admin' && (
                <div className="profile-detail">
                  <span className="profile-detail__label">Role</span>
                  <span className="badge badge--accent">Admin</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn btn--secondary" onClick={() => navigate('/bookings')}>
            View Bookings
          </button>
          <button className="btn btn--secondary profile-actions__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
