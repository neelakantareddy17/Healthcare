import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar({ title }) {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">MediQ<span>AI</span></Link>
      {title && <h2 className="navbar__title">{title}</h2>}
      <div className="navbar__actions">
        {user && (
          <>
            <Link to="/notifications" className="navbar__icon-btn" title="Notifications">🔔</Link>
            <button className="navbar__logout" onClick={handleLogout} title="Logout">⏻</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
