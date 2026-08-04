import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ title, subtitle, backTo, actions }) {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="header__left">
        {backTo && (
          <button className="header__back" onClick={() => navigate(backTo)}>←</button>
        )}
        <div>
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="header__actions">{actions}</div>}
    </div>
  );
}

export default Header;
