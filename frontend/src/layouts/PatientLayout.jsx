import { Link, useLocation } from 'react-router-dom';
import './PatientLayout.css';

const navItems = [
  { to: '/patient', label: 'Home', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
  ) },
  { to: '/patient/find-doctor', label: 'Find', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ) },
  { to: '/patient/queue', label: 'Queue', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3h12M6 21h12M8 3c0 4 2 5.5 4 6.5m0 0c2 1 4 2.5 4 6.5M16 3c0 4-2 5.5-4 6.5m0 0c-2 1-4 2.5-4 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  ) },
  { to: '/patient/profile', label: 'Profile', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  ) },
];

function PatientLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="pl-shell">
      <header className="pl-header">
        <Link to="/patient" className="pl-brand">
          <span className="pl-brand__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </span>
          MediQ AI
        </Link>

        <div className="pl-header__actions">
          <Link to="/patient/notifications" className="pl-icon-btn" aria-label="Notifications">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </Link>
          <Link to="/patient/profile" className="pl-icon-btn" aria-label="Profile">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </header>

      <main className="pl-content">{children}</main>

      <nav className="pl-nav">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`pl-nav__item ${active ? 'pl-nav__item--active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default PatientLayout;