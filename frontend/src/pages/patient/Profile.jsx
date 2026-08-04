import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import { getInitials } from '../../utils/helpers';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { icon: '📋', label: 'Medical Records', to: '/patient/medical-records' },
    { icon: '📅', label: 'My Appointments', to: '/patient' },
    { icon: '🎫', label: 'Queue Status', to: '/patient/queue' },
    { icon: '🔔', label: 'Notifications', to: '/patient/notifications' },
    { icon: '🔒', label: 'Privacy & Security', to: '#' },
    { icon: '❓', label: 'Help & Support', to: '#' },
  ];

  return (
    <PatientLayout>
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(user?.name)}</div>
        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>
        <p className="profile-phone">📱 {user?.phone || 'Not provided'}</p>
      </div>

      <div className="profile-stats">
        <div className="profile-stat"><span className="profile-stat__num">3</span><span>Appointments</span></div>
        <div className="profile-stat"><span className="profile-stat__num">2</span><span>Doctors</span></div>
        <div className="profile-stat"><span className="profile-stat__num">3</span><span>Records</span></div>
      </div>

      <div className="profile-menu">
        {menuItems.map((item) => (
          <button key={item.label} className="profile-menu-item" onClick={() => navigate(item.to)}>
            <span className="profile-menu-item__icon">{item.icon}</span>
            <span className="profile-menu-item__label">{item.label}</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>
        ))}
      </div>

      <button className="profile-logout" onClick={handleLogout}>
        🚪 Sign Out
      </button>
    </PatientLayout>
  );
}

export default Profile;
