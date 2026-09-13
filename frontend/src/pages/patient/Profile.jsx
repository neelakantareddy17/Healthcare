import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import { getAvatarOption } from '../../utils/avatar';
import { getInitials } from '../../utils/helpers';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profile = {
    name: user?.name || 'Patient',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.patient?.gender || '',
    bloodGroup: user?.patient?.bloodGroup || '',
    avatarId: user?.patient?.avatarId,
  };
  const avatar = getAvatarOption(profile.avatarId) || getAvatarOption('sage');

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
    profile.bloodGroup && { label: 'Blood Group', value: profile.bloodGroup, variant: 'rose', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    ) },
    profile.gender && { label: 'Gender', value: profile.gender, variant: 'teal', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="14" r="5" stroke="currentColor" strokeWidth="1.6" /><path d="M14 10l6-6M16 4h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ) },
  ].filter(Boolean);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PatientLayout>
      <div className="pf-header">
        <div className="pf-avatar-wrap">
          <div className="pf-avatar pf-avatar--placeholder" style={{ background: avatar?.background, color: avatar?.color }}>{getInitials(profile.name)}</div>
        </div>
        <h2 className="pf-name">{profile.name}</h2>
        <span className="pf-membership">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.5 5 5.5.7-4 3.9.9 5.4L12 14.5 7.1 17l.9-5.4-4-3.9L9.5 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          {profile.email || 'Patient account'}
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

    </PatientLayout>
  );
}

export default Profile;