import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import PatientAvatar from '../../components/patient/PatientAvatar';
import { usePatientAvatar } from '../../utils/avatar.jsx';
import './Profile.css';

// Capitalise first letter only (e.g. "MALE" → "Male")
const toTitleCase = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

// Format ISO date → human-readable (e.g. "14 Aug 1995")
const formatDob = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return null;
  }
};

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarId = usePatientAvatar(user?.id);

  // Real data from /auth/me (user + nested user.patient)
  const patient = user?.patient ?? {};

  const displayName   = user?.name  ?? 'Patient';
  const bloodGroup    = patient.bloodGroup ?? null;
  const gender        = patient.gender     ? toTitleCase(patient.gender) : null;
  const dob           = formatDob(patient.dob);

  // Only show stat cards that have real data
  const stats = [
    bloodGroup && {
      label: 'Blood Group',
      value: bloodGroup,
      variant: 'rose',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    gender && {
      label: 'Gender',
      value: gender,
      variant: 'teal',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    dob && {
      label: 'Date of Birth',
      value: dob,
      variant: 'blue',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  ].filter(Boolean);

  const accountLinks = [
    {
      to: '/patient/profile/personal-information',
      label: 'Personal Information',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      to: '/patient/medical-records',
      label: 'Medical History',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M6 3h9l5 5v13H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PatientLayout>
      {/* ── Avatar + name ── */}
      <div className="pf-header">
        <div
          className="pf-avatar-wrap"
          onClick={() => navigate('/patient/profile/personal-information')}
          style={{ cursor: 'pointer' }}
          title="Click to change avatar in Personal Information"
        >
          <PatientAvatar avatarId={avatarId} name={displayName} size={88} showRing />
          <span className="pf-verified" aria-label="Verified account">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <h2 className="pf-name">{displayName}</h2>
        {user?.email && (
          <span className="pf-email">{user.email}</span>
        )}
      </div>

      {/* ── Stats (real data only) ── */}
      {stats.length > 0 && (
        <div className="pf-stats">
          {stats.map((s) => (
            <div key={s.label} className="pf-stat-card">
              <span className={`pf-stat-icon pf-stat-icon--${s.variant}`}>{s.icon}</span>
              <div>
                <p className="pf-stat-label">{s.label}</p>
                <p className="pf-stat-value">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Complete profile prompt (if details are sparse) ── */}
      {stats.length === 0 && (
        <button
          type="button"
          className="pf-complete-prompt"
          onClick={() => navigate('/patient/profile/personal-information')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Complete your health profile — add DOB, gender &amp; blood group</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* ── Account links ── */}
      <p className="pf-section-label">Account Details</p>
      <div className="pf-account-card">
        {accountLinks.map((link) => (
          <button
            key={link.to}
            type="button"
            className="pf-account-row"
            onClick={() => navigate(link.to)}
          >
            <span className="pf-account-icon">{link.icon}</span>
            <span className="pf-account-text">{link.label}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="pf-account-chevron">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <button type="button" className="pf-logout" onClick={handleLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Logout
      </button>

      <button
        type="button"
        className="pf-fab"
        aria-label="Scan QR code"
        onClick={() => navigate('/patient/qr-scanner')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" />
          <path d="M14 14h3v3h-3zM19 14v6M14 19h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </PatientLayout>
  );
}

export default Profile;