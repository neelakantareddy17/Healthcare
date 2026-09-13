import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updatePatient } from '../../services/patient';
import PatientLayout from '../../layouts/PatientLayout';
import PatientAvatar from '../../components/patient/PatientAvatar';
import AvatarPicker from '../../components/patient/AvatarPicker';
import { loadAvatarId, saveAvatarId } from '../../utils/avatar.jsx';
import './PersonalInformation.css';

// Blood group options supported by the backend (free-text String field, but we constrain to standard values)
const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];

// Gender enum values from Prisma schema
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other / Prefer not to say' },
];

// Derived display label
const genderLabel = (val) => GENDERS.find((g) => g.value === val?.toUpperCase())?.label ?? '';

// Format ISO date → YYYY-MM-DD for <input type="date">
const toDateInputValue = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Validate phone: optional, but if provided must be 7–15 digits (with optional +, spaces, dashes)
const isValidPhone = (v) => !v || /^\+?[\d\s\-().]{7,20}$/.test(v.trim());

function PersonalInformation() {
  const { user, register: _r, login: _l, logout: _lo, ...authCtx } = useAuth();
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    bloodGroup: '',
  });

  // ── UI states ─────────────────────────────────────────────────────
  const [avatarId, setAvatarId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // initial data fetch
  const [submitting, setSubmitting] = useState(false);  // form submit in progress
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Prevent duplicate submissions
  const submittingRef = useRef(false);

  // ── Populate form from auth context ───────────────────────────────
  useEffect(() => {
    if (!user) return;

    const patient = user.patient ?? {};
    setForm({
      name:       user.name ?? '',
      phone:      user.phone ?? '',
      dob:        toDateInputValue(patient.dob),
      gender:     patient.gender ?? '',
      address:    patient.address ?? '',
      bloodGroup: patient.bloodGroup ?? '',
    });
    setAvatarId(loadAvatarId(user.id));
    setPageLoading(false);
  }, [user]);

  // ── Field change handler ──────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on edit
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccess(false);
    setApiError('');
  }, []);

  // ── Client-side validation ────────────────────────────────────────
  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (form.phone && !isValidPhone(form.phone)) {
      errors.phone = 'Enter a valid phone number (e.g. +91 9876543210).';
    }

    if (form.dob) {
      const dob = new Date(form.dob);
      if (isNaN(dob.getTime())) {
        errors.dob = 'Enter a valid date.';
      } else if (dob > new Date()) {
        errors.dob = 'Date of birth cannot be in the future.';
      }
    }

    return errors;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return; // guard duplicate clicks

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      document.getElementById(`pi-${firstKey}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setApiError('');
    setSuccess(false);

    try {
      const patientId = user?.patient?.id;
      if (!patientId) throw new Error('Patient profile not found. Please contact support.');

      // Build payload — only send non-empty optional fields
      const payload = {
        name: form.name.trim(),
        ...(form.phone.trim()      ? { phone: form.phone.trim() }           : { phone: null }),
        ...(form.dob               ? { dob: new Date(form.dob).toISOString() } : {}),
        ...(form.gender            ? { gender: form.gender.toUpperCase() }   : {}),
        ...(form.address.trim()    ? { address: form.address.trim() }         : {}),
        ...(form.bloodGroup        ? { bloodGroup: form.bloodGroup }          : {}),
      };

      await updatePatient(patientId, payload);

      // Persist avatar selection locally (User/Patient schema has no avatar column)
      if (user?.id) {
        saveAvatarId(user.id, avatarId);
      }

      // Re-fetch the updated user so AuthContext stays in sync
      const { getMe } = await import('../../services/auth');
      await getMe(); // updates localStorage + user in context via setUser on next render

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setApiError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (pageLoading) {
    return (
      <PatientLayout>
        <div className="pi-header">
          <button className="pi-back" onClick={() => navigate('/patient/profile')} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="pi-title">Personal Information</h1>
        </div>
        <div className="pi-skeleton-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pi-skeleton-field">
              <div className="pi-skeleton pi-skeleton--label" />
              <div className="pi-skeleton pi-skeleton--input" />
            </div>
          ))}
        </div>
      </PatientLayout>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <PatientLayout>
      {/* ── Page header ── */}
      <div className="pi-header">
        <button
          className="pi-back"
          onClick={() => navigate('/patient/profile')}
          aria-label="Go back to profile"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="pi-title">Personal Information</h1>
      </div>

      <p className="pi-subtitle">
        Keep your health profile up to date so doctors can provide the best care.
      </p>

      {/* ── Success banner ── */}
      {success && (
        <div className="pi-banner pi-banner--success" role="status" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 12.5l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Your details have been saved successfully!</span>
        </div>
      )}

      {/* ── Error banner ── */}
      {apiError && (
        <div className="pi-banner pi-banner--error" role="alert" aria-live="assertive">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="pi-form" noValidate>

        {/* Profile Avatar Selection */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label">Profile Avatar</label>
            <span className="pi-badge" style={{ background: '#e8f5f3', color: '#0d6e64' }}>Interactive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <PatientAvatar avatarId={avatarId} name={form.name || user?.name} size={64} showRing />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#101828' }}>
                {avatarId ? 'Current Selected Avatar' : 'Initials Fallback Active'}
              </p>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#667085' }}>
                {avatarId
                  ? 'Click any illustration below to switch, or click Remove Selection to revert to initials.'
                  : 'Select an illustration below to personalize your account, or keep your initials.'}
              </p>
            </div>
          </div>
          <AvatarPicker value={avatarId} onChange={setAvatarId} />
        </div>

        {/* Email — read-only display */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-email">Email Address</label>
            <span className="pi-badge pi-badge--readonly">Read-only</span>
          </div>
          <div className="pi-input-wrap pi-input-wrap--readonly">
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="pi-email"
              name="email"
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="pi-input pi-input--readonly"
              aria-readonly="true"
            />
            <svg className="pi-lock-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <p className="pi-hint">Email cannot be changed. Contact support if needed.</p>
        </div>

        {/* Full Name */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-name">
              Full Name <span className="pi-required" aria-label="required">*</span>
            </label>
          </div>
          <div className={`pi-input-wrap ${fieldErrors.name ? 'pi-input-wrap--error' : ''}`}>
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="pi-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="pi-input"
              placeholder="e.g. Priya Sharma"
              autoComplete="name"
              required
              aria-required="true"
              aria-describedby={fieldErrors.name ? 'pi-name-error' : undefined}
              aria-invalid={!!fieldErrors.name}
            />
          </div>
          {fieldErrors.name && (
            <p className="pi-field-error" id="pi-name-error" role="alert">{fieldErrors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-phone">Phone Number</label>
            <span className="pi-badge">Optional</span>
          </div>
          <div className={`pi-input-wrap ${fieldErrors.phone ? 'pi-input-wrap--error' : ''}`}>
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h3.2l1.2 4.3-2 1.5a13 13 0 006.8 6.8l1.5-2 4.3 1.2V19c0 1-.9 1.8-1.9 1.6C10.7 19.6 4.4 13.3 3.4 6.9 3.2 5.9 4 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <input
              id="pi-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="pi-input"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              aria-describedby={fieldErrors.phone ? 'pi-phone-error' : 'pi-phone-hint'}
              aria-invalid={!!fieldErrors.phone}
            />
          </div>
          {fieldErrors.phone ? (
            <p className="pi-field-error" id="pi-phone-error" role="alert">{fieldErrors.phone}</p>
          ) : (
            <p className="pi-hint" id="pi-phone-hint">Include country code, e.g. +91 or +1</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-dob">Date of Birth</label>
            <span className="pi-badge">Optional</span>
          </div>
          <div className={`pi-input-wrap ${fieldErrors.dob ? 'pi-input-wrap--error' : ''}`}>
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="pi-dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              className="pi-input pi-input--date"
              max={today}
              aria-describedby={fieldErrors.dob ? 'pi-dob-error' : undefined}
              aria-invalid={!!fieldErrors.dob}
            />
          </div>
          {fieldErrors.dob && (
            <p className="pi-field-error" id="pi-dob-error" role="alert">{fieldErrors.dob}</p>
          )}
        </div>

        {/* Gender */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-gender">Gender</label>
            <span className="pi-badge">Optional</span>
          </div>
          <div className="pi-input-wrap pi-input-wrap--select">
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <select
              id="pi-gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`pi-input pi-select ${!form.gender ? 'pi-select--placeholder' : ''}`}
            >
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <svg className="pi-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Blood Group */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-bloodGroup">Blood Group</label>
            <span className="pi-badge">Optional</span>
          </div>
          <div className="pi-input-wrap pi-input-wrap--select">
            <svg className="pi-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <select
              id="pi-bloodGroup"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className={`pi-input pi-select ${!form.bloodGroup ? 'pi-select--placeholder' : ''}`}
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <svg className="pi-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Address */}
        <div className="pi-field">
          <div className="pi-label-row">
            <label className="pi-label" htmlFor="pi-address">Home Address</label>
            <span className="pi-badge">Optional</span>
          </div>
          <div className="pi-textarea-wrap">
            <svg className="pi-textarea-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-8-5.6-8-11A8 8 0 0 1 20 10c0 5.4-8 11-8 11z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <textarea
              id="pi-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="pi-textarea"
              placeholder="Street, City, State, PIN code"
              rows={3}
              autoComplete="street-address"
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="pi-actions">
          <button
            type="button"
            className="pi-btn pi-btn--ghost"
            onClick={() => navigate('/patient/profile')}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            id="pi-submit"
            className="pi-btn pi-btn--primary"
            disabled={submitting}
            aria-live="polite"
            aria-label={submitting ? 'Saving your details…' : 'Save changes'}
          >
            {submitting ? (
              <>
                <span className="pi-spinner" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        <p className="pi-footer-note">
          Fields marked <span className="pi-required">*</span> are required. Your data is protected per our Privacy Policy.
        </p>
      </form>
    </PatientLayout>
  );
}

export default PersonalInformation;
