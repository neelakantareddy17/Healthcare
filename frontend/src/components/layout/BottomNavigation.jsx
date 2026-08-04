import { NavLink } from 'react-router-dom';
import './BottomNavigation.css';

function BottomNavigation({ role = 'patient' }) {
  const patientTabs = [
    { to: '/patient', icon: '🏠', label: 'Home' },
    { to: '/patient/find-doctor', icon: '🔍', label: 'Doctors' },
    { to: '/patient/queue', icon: '🎫', label: 'Queue' },
    { to: '/patient/notifications', icon: '🔔', label: 'Alerts' },
    { to: '/patient/profile', icon: '👤', label: 'Profile' },
  ];
  const doctorTabs = [
    { to: '/doctor', icon: '📊', label: 'Dashboard' },
    { to: '/doctor/queue', icon: '🎫', label: 'Queue' },
    { to: '/doctor/patients', icon: '👥', label: 'Patients' },
    { to: '/doctor/schedule', icon: '📅', label: 'Schedule' },
    { to: '/doctor/profile', icon: '👤', label: 'Profile' },
  ];
  const adminTabs = [
    { to: '/admin', icon: '📊', label: 'Dashboard' },
    { to: '/admin/doctors', icon: '🩺', label: 'Doctors' },
    { to: '/admin/patients', icon: '👥', label: 'Patients' },
    { to: '/admin/reports', icon: '📋', label: 'Reports' },
  ];

  const tabs = role === 'doctor' ? doctorTabs : role === 'admin' ? adminTabs : patientTabs;

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/patient' || tab.to === '/doctor' || tab.to === '/admin'}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavigation;
