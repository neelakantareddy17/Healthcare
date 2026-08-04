import './AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <h1 className="auth-layout__logo">MediQ<span>AI</span></h1>
        <p className="auth-layout__tagline">Smart Healthcare, Right at Your Fingertips</p>
      </div>
      <div className="auth-layout__card">{children}</div>
    </div>
  );
}

export default AuthLayout;
