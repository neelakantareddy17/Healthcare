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
  const [showDemo, setShowDemo] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const redirectMap = { patient: '/patient', doctor: '/doctor', admin: '/admin' };

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

  const demoLogin = async (role) => {
    const creds = {
      patient: { email: 'patient@demo.com', password: 'demo123' },
      doctor: { email: 'doctor@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' },
    };
    setForm(creds[role]);
    setError('');
    setLoading(true);
    try {
      const user = await login(creds[role].email, creds[role].password);
      navigate(redirectMap[user.role] || '/patient');
    } catch (err) {
      setError(err.message);
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

        <div className="mq-divider"><span>OR</span></div>

        <button type="button" className="mq-sso" onClick={() => setShowDemo((s) => !s)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.66-2.85z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 00-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
          </svg>
          Continue with SSO
        </button>

        {showDemo && (
          <div className="mq-demo-row">
            <button type="button" className="mq-demo-btn" onClick={() => demoLogin('patient')}>👤 Patient</button>
            <button type="button" className="mq-demo-btn" onClick={() => demoLogin('doctor')}>🩺 Doctor</button>
            <button type="button" className="mq-demo-btn mq-demo-btn--admin" onClick={() => demoLogin('admin')}>🛡️ Admin</button>
          </div>
        )}

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