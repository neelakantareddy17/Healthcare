import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import './BottomNavigation.css';

function BottomNavigation({ role = 'patient' }) {
  const patientTabs = [
    { to: '/patient', icon: 'home', label: 'Home' },
    { to: '/patient/find-doctor', icon: 'doctor', label: 'Doctors' },
    { to: '/patient/queue', icon: 'queue', label: 'Queue' },
    { to: '/patient/notifications', icon: 'notification', label: 'Alerts' },
    { to: '/patient/profile', icon: 'user', label: 'Profile' },
  ];
  const doctorTabs = [
    { to: '/doctor', icon: 'activity', label: 'Dashboard' },
    { to: '/doctor/queue', icon: 'queue', label: 'Queue' },
    { to: '/doctor/patients', icon: 'users', label: 'Patients' },
    { to: '/doctor/schedule', icon: 'calendar', label: 'Schedule' },
    { to: '/doctor/profile', icon: 'user', label: 'Profile' },
  ];
  const adminTabs = [
    { to: '/admin', icon: 'activity', label: 'Dashboard' },
    { to: '/admin/doctors', icon: 'doctor', label: 'Doctors' },
    { to: '/admin/patients', icon: 'users', label: 'Patients' },
    { to: '/admin/reports', icon: 'clipboard', label: 'Reports' },
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
          <span className="bottom-nav__icon"><Icon name={tab.icon} size={20} /></span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavigation;
