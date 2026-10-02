import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { initializeData } from './services/dataService.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MoviesPage from './pages/Movies.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Booking from './pages/Booking.jsx';
import CinemasPage from './pages/Cinemas.jsx';
import CinemaDetail from './pages/CinemaDetail.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Offers from './pages/Offers.jsx';
import Admin from './pages/Admin.jsx';
import './styles/global.css';

// Initialize sample data in localStorage
initializeData();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/booking/:movieId" element={<Booking />} />
            <Route path="/cinemas" element={<CinemasPage />} />
            <Route path="/cinemas/:id" element={<CinemaDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
