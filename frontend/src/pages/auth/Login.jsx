import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const redirectMap = {
  PATIENT: '/patient',
  DOCTOR: '/doctor',
  ADMIN: '/admin',
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(redirectMap[user.role] || '/patient');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mq-page">
      <div className="mq-card">
       
        <div className="mq-brand">
          <div className="mq-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="14" height="16" rx="1.5" stroke="white" strokeWidth="1.6" />
              <line x1="6" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="6" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="17.5" cy="16.5" r="4.5" fill="#0F3D52" stroke="white" strokeWidth="1.4" />
              <circle cx="17.5" cy="15.2" r="1.3" fill="white" />
              <path d="M15.3 18.2c0-1.3 1-2 2.2-2s2.2.7 2.2 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="mq-brand-name">MediQ AI</span>
        </div>

        <h1 className="mq-title">Welcome Back</h1>
        <p className="mq-subtitle">Please enter your clinical credentials</p>

        {error && <div className="mq-error">{error}</div>}

        <form onSubmit={handleSubmit} className="mq-form">
          <label className="mq-label" htmlFor="email">Work Email</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="dr.smith@hospital.org"
              value={form.email}
              onChange={handleChange}
              className="mq-input"
              autoComplete="email"
              required
            />
          </div>

          <div className="mq-row-between">
            <label className="mq-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="mq-forgot">Forgot Password?</Link>
          </div>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="mq-input"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="mq-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.7 9.7 0 0112 5c5 0 9 4 10 7-.4 1.2-1.3 2.6-2.5 3.8M6.5 6.7C4.4 8 3 9.9 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" className="mq-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="mq-signup">
          New to the platform? <Link to="/register">Create Account</Link>
        </p>

        <p className="mq-terms">
          By logging in, you agree to MediQ AI's HIPAA-compliant terms of service and clinical privacy policy.
        </p>
      </div>
    </div>
  );
}

export default Login;