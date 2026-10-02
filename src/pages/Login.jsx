import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateEmail, validatePhone } from '../utils/helpers.js';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const { addToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (isRegister && !form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email';
    if (isRegister && !form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (isRegister && !validatePhone(form.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegister) {
      const result = register(form);
      if (result.success) {
        addToast('Account created successfully!', 'success');
        navigate('/');
      } else {
        addToast(result.error, 'error');
      }
    } else {
      const result = login(form.email, form.password);
      if (result.success) {
        addToast('Welcome back!', 'success');
        navigate('/');
      } else {
        addToast(result.error, 'error');
      }
    }
  };

  return (
    <div className="page">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">{isRegister ? 'Create Account' : 'Login'}</h1>
            <p className="auth-card__subtitle">
              {isRegister
                ? 'Sign up to start booking movie tickets'
                : 'Welcome back! Sign in to your account'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`input ${errors.name ? 'input--error' : ''}`}
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="input-error-text">{errors.name}</span>}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`input ${errors.email ? 'input--error' : ''}`}
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="input-error-text">{errors.email}</span>}
            </div>

            {isRegister && (
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input--error' : ''}`}
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="input-error-text">{errors.phone}</span>}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input ${errors.password ? 'input--error' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <span className="input-error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn--primary btn--lg btn--full">
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="auth-card__footer">
            <p>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                className="auth-toggle"
                onClick={() => { setIsRegister(!isRegister); setErrors({}); }}
              >
                {isRegister ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}
