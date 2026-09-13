import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import Icon from '../common/Icon';

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
            <Link to="/notifications" className="navbar__icon-btn" title="Notifications" aria-label="Notifications"><Icon name="notification" size={19} /></Link>
            <button className="navbar__logout" onClick={handleLogout} title="Logout" aria-label="Logout"><Icon name="logout" size={18} /></button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
