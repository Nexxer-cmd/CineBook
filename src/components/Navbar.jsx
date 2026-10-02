import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/movies', label: 'Movies' },
    { path: '/cinemas', label: 'Cinemas' },
    { path: '/offers', label: 'Offers' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" aria-label="CineBook Home">
          <span className="navbar__logo-icon">▶</span>
          <span className="navbar__logo-text">CineBook</span>
        </Link>

        <div className="navbar__links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          {/* Search */}
          <div className="navbar__search-wrapper" ref={searchRef}>
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>            </button>
            {searchOpen && (
              <form className="navbar__search-dropdown" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="input"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="navbar__profile" ref={profileRef}>
              <button
                className="navbar__profile-btn"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-label="User menu"
              >
                <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
              </button>
              {profileMenuOpen && (
                <div className="navbar__profile-menu">
                  <div className="navbar__profile-info">
                    <span className="navbar__profile-name">{user.name}</span>
                    <span className="navbar__profile-email">{user.email}</span>
                  </div>
                  <div className="navbar__profile-divider" />
                  <Link to="/profile" className="navbar__profile-item">Profile</Link>
                  <Link to="/bookings" className="navbar__profile-item">My Bookings</Link>
                  {isAdmin && (
                    <Link to="/admin" className="navbar__profile-item">Admin Panel</Link>
                  )}
                  <div className="navbar__profile-divider" />
                  <button
                    className="navbar__profile-item navbar__profile-item--logout"
                    onClick={() => { logout(); setProfileMenuOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`navbar__hamburger ${mobileMenuOpen ? 'navbar__hamburger--open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu">
          <div className="container">
            <form className="navbar__mobile-search" onSubmit={handleSearch}>
              <input
                type="text"
                className="input"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__mobile-link ${isActive(link.path) ? 'navbar__mobile-link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/profile" className="navbar__mobile-link">Profile</Link>
                <Link to="/bookings" className="navbar__mobile-link">My Bookings</Link>
                {isAdmin && (
                  <Link to="/admin" className="navbar__mobile-link">Admin Panel</Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
