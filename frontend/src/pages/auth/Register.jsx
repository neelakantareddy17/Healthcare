import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientAvatar from '../../components/patient/PatientAvatar';
import AvatarPicker from '../../components/patient/AvatarPicker';
import { saveAvatarId } from '../../utils/avatar.jsx';
import './Auth.css';

// ── Constants (matched to Prisma schema / backend registerSchema) ─────────────
const GENDERS = [
  { value: 'MALE',   label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER',  label: 'Other / Prefer not to say' },
];

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];

const isValidPhone = (v) => !v || /^\+?[\d\s\-().]{7,20}$/.test(v.trim());

// ── Multi-step config ─────────────────────────────────────────────────────────
// Step 1 → account credentials (required)
// Step 2 → health details (all optional, can be edited later from profile)
const STEPS = [
  { id: 'account', label: 'Account',  number: 1 },
  { id: 'health',  label: 'Details',  number: 2 },
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  // ── Form state ────────────────────────────────────────────────────
  const [step, setStep] = useState(0); // 0 = account, 1 = health details

  const [form, setForm] = useState({
    // Step 1 — required by backend
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    // optional even in Step 1
    phone:           '',
    // Step 2 — all optional
    dob:             '',
    gender:          '',
    address:         '',
    bloodGroup:      '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState('av1');
  const [agreed,       setAgreed]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [apiError,     setApiError]     = useState('');
  const [fieldErrors,  setFieldErrors]  = useState({});

  // ── Field change ──────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }, []);

  // ── Step-1 validation ─────────────────────────────────────────────
  const validateStep1 = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (form.phone && !isValidPhone(form.phone)) {
      errors.phone = 'Enter a valid phone number (e.g. +91 98765 43210).';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  // ── Step-2 validation (all optional, but range-check DOB) ─────────
  const validateStep2 = () => {
    const errors = {};
    if (form.dob) {
      const dob = new Date(form.dob);
      if (isNaN(dob.getTime())) {
        errors.dob = 'Enter a valid date.';
      } else if (dob > new Date()) {
        errors.dob = 'Date of birth cannot be in the future.';
      }
    }
    if (!agreed) {
      errors.agreed = 'You must agree to the Terms of Service and Privacy Policy.';
    }
    return errors;
  };

  // ── Next step ─────────────────────────────────────────────────────
  const handleNext = (e) => {
    e.preventDefault();
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus first errored field
      const first = Object.keys(errors)[0];
      document.getElementById(`reg-${first}`)?.focus();
      return;
    }
    setFieldErrors({});
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Final submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setApiError('');

    try {
      // Build payload — strip confirmPassword, send optional fields only if non-empty
      const { confirmPassword, dob, gender, address, bloodGroup, phone, ...base } = form;

      const payload = {
        ...base,
        ...(phone.trim()      ? { phone: phone.trim() }                       : {}),
        ...(dob               ? { dob: new Date(dob).toISOString() }          : {}),
        ...(gender            ? { gender: gender.toUpperCase() }              : {}),
        ...(address.trim()    ? { address: address.trim() }                   : {}),
        ...(bloodGroup        ? { bloodGroup }                                : {}),
      };

      const u = await register(payload);
      if (u?.id) {
        saveAvatarId(u.id, selectedAvatar);
      }
      setSuccess(true);

      // Brief pause so the success state is visible before navigating
      setTimeout(() => navigate('/patient'), 1800);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        err?.message                 ||
        'Registration failed. Please try again.';
      setApiError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // ── Shared field-error renderer ───────────────────────────────────
  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="reg-field-error" id={`reg-${name}-error`} role="alert">
        {fieldErrors[name]}
      </p>
    ) : null;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="mq-page">

      {/* ── Brand header ── */}
      <div className="mq-page-header">
        <div className="mq-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

      {/* ── Step indicator ── */}
      <div className="reg-steps" aria-label="Registration progress">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="reg-step-item">
            <div
              className={`reg-step-dot ${idx < step ? 'reg-step-dot--done' : idx === step ? 'reg-step-dot--active' : ''}`}
              aria-current={idx === step ? 'step' : undefined}
            >
              {idx < step ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span>{s.number}</span>
              )}
            </div>
            <span className={`reg-step-label ${idx === step ? 'reg-step-label--active' : ''}`}>
              {s.label}
            </span>
            {idx < STEPS.length - 1 && <div className={`reg-step-line ${idx < step ? 'reg-step-line--done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* ── Card ── */}
      <div className="mq-card">

        {/* Success screen */}
        {success ? (
          <div className="reg-success">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <PatientAvatar avatarId={selectedAvatar} name={form.name} size={72} showRing />
            </div>
            <h2 className="reg-success-title">Welcome to MediQ, {form.name.trim().split(' ')[0]}!</h2>
            <p className="reg-success-sub">Your account has been created with your chosen profile avatar. Redirecting to your dashboard…</p>
            <span className="reg-success-spinner" aria-label="Loading" />
          </div>
        ) : (
          <>
            <h2 className="mq-title mq-title--left">
              {step === 0 ? 'Create Account' : 'Health Details'}
            </h2>
            <p className="mq-subtitle mq-subtitle--left">
              {step === 0
                ? 'Enter your account credentials to get started.'
                : 'Optional — you can also fill this later from your profile.'}
            </p>

            {/* API-level error banner */}
            {apiError && (
              <div className="reg-banner reg-banner--error" role="alert" aria-live="assertive">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>{apiError}</span>
              </div>
            )}

            {/* ═════════════════ STEP 1 — Account ═════════════════ */}
            {step === 0 && (
              <form onSubmit={handleNext} className="mq-form" noValidate aria-label="Account credentials form">

                {/* Full Name */}
                <label className="mq-label" htmlFor="reg-name">
                  Full Name <span className="reg-required" aria-label="required">*</span>
                </label>
                <div className={`mq-input-wrap ${fieldErrors.name ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    className="mq-input"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-describedby={fieldErrors.name ? 'reg-name-error' : undefined}
                    aria-invalid={!!fieldErrors.name}
                  />
                </div>
                <FieldError name="name" />

                {/* Email */}
                <label className="mq-label mq-label--spaced" htmlFor="reg-email">
                  Email Address <span className="reg-required" aria-label="required">*</span>
                </label>
                <div className={`mq-input-wrap ${fieldErrors.email ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="priya.sharma@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="mq-input"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                    aria-invalid={!!fieldErrors.email}
                  />
                </div>
                <FieldError name="email" />

                {/* Phone (optional) */}
                <div className="reg-label-row mq-label--spaced">
                  <label className="mq-label" htmlFor="reg-phone">Phone Number</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <div className={`mq-input-wrap ${fieldErrors.phone ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4h3.2l1.2 4.3-2 1.5a13 13 0 006.8 6.8l1.5-2 4.3 1.2V19c0 1-.9 1.8-1.9 1.6C10.7 19.6 4.4 13.3 3.4 6.9 3.2 5.9 4 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className="mq-input"
                    autoComplete="tel"
                    aria-describedby={fieldErrors.phone ? 'reg-phone-error' : 'reg-phone-hint'}
                    aria-invalid={!!fieldErrors.phone}
                  />
                </div>
                {fieldErrors.phone
                  ? <FieldError name="phone" />
                  : <p className="reg-hint" id="reg-phone-hint">Include country code, e.g. +91 or +1</p>
                }

                {/* Password */}
                <label className="mq-label mq-label--spaced" htmlFor="reg-password">
                  Password <span className="reg-required" aria-label="required">*</span>
                </label>
                <div className={`mq-input-wrap ${fieldErrors.password ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="mq-input"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-describedby={fieldErrors.password ? 'reg-password-error' : 'reg-password-hint'}
                    aria-invalid={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    className="mq-eye"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.7 9.7 0 0112 5c5 0 9 4 10 7-.4 1.2-1.3 2.6-2.5 3.8M6.5 6.7C4.4 8 3 9.9 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password
                  ? <FieldError name="password" />
                  : <p className="reg-hint" id="reg-password-hint">Minimum 6 characters</p>
                }

                {/* Confirm Password */}
                <label className="mq-label mq-label--spaced" htmlFor="reg-confirmPassword">
                  Confirm Password <span className="reg-required" aria-label="required">*</span>
                </label>
                <div className={`mq-input-wrap ${fieldErrors.confirmPassword ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <input
                    id="reg-confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="mq-input"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-describedby={fieldErrors.confirmPassword ? 'reg-confirmPassword-error' : undefined}
                    aria-invalid={!!fieldErrors.confirmPassword}
                  />
                </div>
                <FieldError name="confirmPassword" />

                <button
                  type="submit"
                  id="reg-next-btn"
                  className="mq-submit mq-submit--solid"
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}

            {/* ═════════════════ STEP 2 — Health Details ═════════════════ */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="mq-form" noValidate aria-label="Health details form">

                {/* Patient Avatar Selection */}
                <div className="reg-label-row">
                  <label className="mq-label">Choose Profile Avatar</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <p style={{ fontSize: '13px', color: '#667085', marginTop: '-4px', marginBottom: '10px' }}>
                  Pick an illustration for your profile. If skipped, your name initials will be displayed.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <AvatarPicker value={selectedAvatar} onChange={setSelectedAvatar} />
                </div>

                {/* Date of Birth */}
                <div className="reg-label-row">
                  <label className="mq-label" htmlFor="reg-dob">Date of Birth</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <div className={`mq-input-wrap ${fieldErrors.dob ? 'mq-input-wrap--error' : ''}`}>
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <input
                    id="reg-dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="mq-input mq-input--date"
                    max={today}
                    aria-describedby={fieldErrors.dob ? 'reg-dob-error' : undefined}
                    aria-invalid={!!fieldErrors.dob}
                  />
                </div>
                <FieldError name="dob" />

                {/* Gender */}
                <div className="reg-label-row mq-label--spaced">
                  <label className="mq-label" htmlFor="reg-gender">Gender</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <div className="mq-input-wrap mq-input-wrap--select">
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <select
                    id="reg-gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`mq-input mq-select ${!form.gender ? 'mq-select--placeholder' : ''}`}
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <svg className="mq-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Blood Group */}
                <div className="reg-label-row mq-label--spaced">
                  <label className="mq-label" htmlFor="reg-bloodGroup">Blood Group</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <div className="mq-input-wrap mq-input-wrap--select">
                  <svg className="mq-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <select
                    id="reg-bloodGroup"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className={`mq-input mq-select ${!form.bloodGroup ? 'mq-select--placeholder' : ''}`}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <svg className="mq-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Address */}
                <div className="reg-label-row mq-label--spaced">
                  <label className="mq-label" htmlFor="reg-address">Home Address</label>
                  <span className="reg-badge">Optional</span>
                </div>
                <div className="mq-textarea-wrap">
                  <svg className="mq-textarea-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s-8-5.6-8-11A8 8 0 0 1 20 10c0 5.4-8 11-8 11z" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <textarea
                    id="reg-address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="mq-textarea"
                    placeholder="Street, City, State, PIN code"
                    rows={3}
                    autoComplete="street-address"
                  />
                </div>

                {/* Terms checkbox */}
                <label className={`mq-checkbox-row ${fieldErrors.agreed ? 'mq-checkbox-row--error' : ''}`}>
                  <input
                    id="reg-agreed"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setFieldErrors((prev) => ({ ...prev, agreed: '' }));
                    }}
                    className="mq-checkbox"
                    aria-describedby={fieldErrors.agreed ? 'reg-agreed-error' : undefined}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="mq-terms-link">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="mq-terms-link">Privacy Policy</Link>.
                  </span>
                </label>
                {fieldErrors.agreed && (
                  <p className="reg-field-error" id="reg-agreed-error" role="alert">
                    {fieldErrors.agreed}
                  </p>
                )}

                {/* Buttons */}
                <div className="reg-btn-row">
                  <button
                    type="button"
                    id="reg-back-btn"
                    className="mq-submit reg-btn-ghost"
                    onClick={() => { setStep(0); setFieldErrors({}); setApiError(''); }}
                    disabled={submitting}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>

                  <button
                    type="submit"
                    id="reg-submit-btn"
                    className="mq-submit mq-submit--solid"
                    disabled={submitting}
                    aria-live="polite"
                  >
                    {submitting ? (
                      <>
                        <span className="reg-spinner" aria-hidden="true" />
                        Creating…
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <p className="reg-footer-note">
                  <span className="reg-required">*</span> required fields. All health details can be updated later in your profile.
                </p>
              </form>
            )}

            <p className="mq-signup">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
      </div>

      {/* ── Insight card ── */}
      {!success && (
        <div className="mq-insight">
          <div className="mq-insight-icon">
            {step === 0 ? '🔒' : '🩺'}
          </div>
          <div>
            <p className="mq-insight-title">
              {step === 0 ? 'Secure Registration' : 'Why health details?'}
            </p>
            <p className="mq-insight-text">
              {step === 0
                ? 'Your data is encrypted end-to-end. We never share personal information without your consent.'
                : 'Providing your health details helps doctors deliver faster, more personalised care during appointments.'}
            </p>
          </div>
        </div>
      )}

      <p className="mq-footer-note">
        Secured by HIPAA-compliant encryption &copy; {new Date().getFullYear()} MediQ AI Solutions
      </p>
    </div>
  );
}

export default Register;