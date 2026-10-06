import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/layout/BottomNavigation';
import Icon from '../components/common/Icon';
import './AdminLayout.css';

const navigationGroups = [
  {
    label: 'Main',
    links: [{ to: '/admin', icon: 'home', label: 'Dashboard', end: true }],
  },
  {
    label: 'Management',
    links: [
      { to: '/admin/doctors', icon: 'doctor', label: 'Doctors' },
      { to: '/admin/patients', icon: 'users', label: 'Patients' },
    ],
  },
  {
    label: 'Insights',
    links: [{ to: '/admin/reports', icon: 'activity', label: 'Analytics' }],
  },
];

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const adminName = user?.name || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <NavLink to="/admin" className="admin-sidebar__brand">
          <span className="admin-sidebar__logo"><Icon name="logo" size={22} /></span>
          <span>
            <span className="admin-sidebar__brand-name">MediQ <span>AI</span></span>
            <span className="admin-sidebar__brand-caption">Admin Portal</span>
          </span>
        </NavLink>

        <nav className="admin-sidebar__nav">
          {navigationGroups.map((group) => (
            <div className="admin-sidebar__group" key={group.label}>
              <p className="admin-sidebar__group-label">{group.label}</p>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
                >
                  <Icon name={link.icon} size={18} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <Icon name="logout" size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="admin-layout__main">
        <header className="admin-header">
          <div>
            <p className="admin-header__eyebrow">MediQ AI</p>
            <h1 className="admin-header__title">Admin Portal</h1>
          </div>
          <div className="admin-header__profile">
            <span className="admin-header__avatar"><Icon name="user" size={18} /></span>
            <span className="admin-header__name">{adminName}</span>
            <button className="admin-header__logout" onClick={handleLogout} aria-label="Logout" title="Logout">
              <Icon name="logout" size={18} />
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>

      <BottomNavigation role="admin" />
    </div>
  );
}

export default AdminLayout;
