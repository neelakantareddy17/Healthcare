import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_OPTIONS } from '../../utils/avatar';
import './Auth.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', gender: '', address: '', bloodGroup: '', avatarId: 'sage', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Clinical Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      if (!payload.dob) delete payload.dob;
      if (!payload.gender) delete payload.gender;
      if (!payload.address) delete payload.address;
      if (!payload.bloodGroup) delete payload.bloodGroup;
      await register(payload);
      navigate('/patient');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mq-page">
      <div className="mq-page-header">
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
        <h1 className="mq-page-brand">MediQ AI</h1>
        <p className="mq-page-tagline">Smart Healthcare Registration</p>
      </div>

      <div className="mq-card">
        <h2 className="mq-title mq-title--left">Create Account</h2>
        <p className="mq-subtitle mq-subtitle--left">Join our clinical network today.</p>

        {error && <div className="mq-error">{error}</div>}

        <form onSubmit={handleSubmit} className="mq-form">
          <label className="mq-label" htmlFor="name">Full Name</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Dr. Jane Smith"
              value={form.name}
              onChange={handleChange}
              className="mq-input"
              autoComplete="name"
              required
            />
          </div>

          <label className="mq-label mq-label--spaced" htmlFor="email">Email Address</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane.smith@hospital.org"
              value={form.email}
              onChange={handleChange}
              className="mq-input"
              autoComplete="email"
              required
            />
          </div>

          <label className="mq-label mq-label--spaced" htmlFor="phone">Phone Number</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h3.2l1.2 4.3-2 1.5a13 13 0 006.8 6.8l1.5-2 4.3 1.2V19c0 1-.9 1.8-1.9 1.6C10.7 19.6 4.4 13.3 3.4 6.9 3.2 5.9 4 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
              className="mq-input"
              autoComplete="tel"
              required
            />
          </div>

          <div className="mq-form-grid">
            <div>
              <label className="mq-label mq-label--spaced" htmlFor="dob">Date of Birth</label>
              <input id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} className="mq-input mq-input--standalone" autoComplete="bday" />
            </div>
            <div>
              <label className="mq-label mq-label--spaced" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="mq-input mq-input--standalone">
                <option value="">Prefer not to say</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <label className="mq-label mq-label--spaced" htmlFor="address">Address</label>
          <textarea id="address" name="address" value={form.address} onChange={handleChange} className="mq-input mq-input--standalone mq-textarea" rows={2} autoComplete="street-address" />

          <label className="mq-label mq-label--spaced" htmlFor="bloodGroup">Blood Group (optional)</label>
          <input id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="mq-input mq-input--standalone" placeholder="e.g. O+" />

          <fieldset className="mq-avatar-fieldset">
            <legend className="mq-label mq-label--spaced">Choose an avatar</legend>
            <div className="mq-avatar-options">
              {AVATAR_OPTIONS.map((avatar) => (
                <label key={avatar.id} className={`mq-avatar-option ${form.avatarId === avatar.id ? 'mq-avatar-option--selected' : ''}`}>
                  <input type="radio" name="avatarId" value={avatar.id} checked={form.avatarId === avatar.id} onChange={handleChange} />
                  <span style={{ background: avatar.background, color: avatar.color }}>{form.name ? form.name.slice(0, 1).toUpperCase() : 'P'}</span>
                  <small>{avatar.label}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mq-label mq-label--spaced" htmlFor="password">Password</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              className="mq-input"
              autoComplete="new-password"
              minLength={6}
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

          <label className="mq-label mq-label--spaced" htmlFor="confirmPassword">Confirm Password</label>
          <div className="mq-input-wrap">
            <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mq-input"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <label className="mq-checkbox-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mq-checkbox"
            />
            <span>
              I agree to the <Link to="/terms" className="mq-terms-link">Clinical Terms of Service</Link> and{' '}
              <Link to="/privacy" className="mq-terms-link">Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" className="mq-submit mq-submit--solid" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="mq-signup">
          Already have a clinical account? <Link to="/login">Sign In</Link>
        </p>
      </div>

      <div className="mq-insight">
        <div className="mq-insight-icon">✨</div>
        <div>
          <p className="mq-insight-title">MediQ Insight</p>
          <p className="mq-insight-text">
            Registration enables real-time patient queue optimization and AI-assisted clinical documentation.
          </p>
        </div>
      </div>

      <p className="mq-footer-note">
        Secured by HIPAA-compliant encryption &copy; {new Date().getFullYear()} MediQ AI Solutions
      </p>
    </div>
  );
}

export default Register;