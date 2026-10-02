import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">▶</span>
              <span>CineBook</span>
            </Link>
            <p className="footer__tagline">
              Book movie tickets at the best cinemas near you. Simple, fast, reliable.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <Link to="/movies" className="footer__link">Movies</Link>
            <Link to="/cinemas" className="footer__link">Cinemas</Link>
            <Link to="/offers" className="footer__link">Offers</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Help</h4>
            <span className="footer__link">FAQs</span>
            <span className="footer__link">Terms of Use</span>
            <span className="footer__link">Privacy Policy</span>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <span className="footer__link">support@cinebook.com</span>
            <span className="footer__link">+91 1800 123 4567</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 CineBook. All rights reserved.</p>
          <p className="footer__demo-note">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  );
}
