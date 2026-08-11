import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import './Profile.css';

// TODO: confirm these fields actually exist on your `user` object / patient profile API.
// Falling back to screenshot values so the page never looks broken while you wire real data.
const FALLBACK = {
  name: 'Alex Johnson',
  photo: '',
  membership: 'Premium Member',
  bloodType: 'O+',
  weightKg: 72,
  heightCm: 180,
};

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profile = {
    name: user?.name || FALLBACK.name,
    photo: user?.photo || FALLBACK.photo,
    membership: user?.membership || FALLBACK.membership,
    bloodType: user?.bloodType || FALLBACK.bloodType,
    weightKg: user?.weightKg ?? FALLBACK.weightKg,
    heightCm: user?.heightCm ?? FALLBACK.heightCm,
  };

  const accountLinks = [
    { to: '/patient/profile/personal-information', label: 'Personal Information', icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ) },
    { to: '/patient/medical-records', label: 'Medical History', icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M6 3h9l5 5v13H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ) },
    { to: '/patient/profile/insurance', label: 'Insurance Details', icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    ) },
    { to: '/patient/profile/payment-methods', label: 'Payment Methods', icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" /></svg>
    ) },
    { to: '/patient/profile/security', label: 'Security Settings', icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" /></svg>
    ) },
  ];

  const stats = [
    { label: 'Blood Type', value: profile.bloodType, variant: 'rose', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    ) },
    { label: 'Weight', value: `${profile.weightKg}kg`, variant: 'teal', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ) },
    { label: 'Height', value: `${profile.heightCm}cm`, variant: 'blue', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3h8M8 21h8M12 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 6h2M12 10h2M12 14h2M12 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ) },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PatientLayout>
      <div className="pf-header">
        <div className="pf-avatar-wrap">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="pf-avatar" />
          ) : (
            <div className="pf-avatar pf-avatar--placeholder" />
          )}
          <span className="pf-verified">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <h2 className="pf-name">{profile.name}</h2>
        <span className="pf-membership">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.5 5 5.5.7-4 3.9.9 5.4L12 14.5 7.1 17l.9-5.4-4-3.9L9.5 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          {profile.membership}
        </span>
      </div>

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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Logout
      </button>

      {/* TODO: confirm what this should open — assumed AI assistant/QR scanner based on the app's icon set */}
      <button
        type="button"
        className="pf-fab"
        aria-label="Open assistant"
        onClick={() => navigate('/patient/qr-scanner')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" /><rect x="13" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" /><rect x="4" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.6" /><path d="M14 14h3v3h-3zM19 14v6M14 19h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
    </PatientLayout>
  );
}

export default Profile;