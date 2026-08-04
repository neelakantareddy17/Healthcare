import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectMap = { patient: '/patient', doctor: '/doctor', admin: '/admin' };
      navigate(redirectMap[user.role] || '/patient');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    const creds = {
      patient: { email: 'patient@demo.com', password: 'demo123' },
      doctor: { email: 'doctor@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' },
    };
    setForm(creds[role]);
    setError('');
    setLoading(true);
    try {
      const user = await login(creds[role].email, creds[role].password);
      const redirectMap = { patient: '/patient', doctor: '/doctor', admin: '/admin' };
      navigate(redirectMap[user.role] || '/patient');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome Back 👋</h2>
      <p className="auth-subtitle">Sign in to continue to MediQ AI</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input label="Email Address" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required icon="📧" />
        <Input label="Password" type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required icon="🔒" />
        <Button title={loading ? 'Signing in...' : 'Sign In'} type="submit" disabled={loading} />
      </form>

      <div className="auth-divider"><span>or try a demo account</span></div>
      <div className="demo-btns">
        <button className="demo-btn" onClick={() => demoLogin('patient')}>👤 Patient</button>
        <button className="demo-btn" onClick={() => demoLogin('doctor')}>🩺 Doctor</button>
        <button className="demo-btn demo-btn--admin" onClick={() => demoLogin('admin')}>🔑 Admin</button>
      </div>

      <p className="auth-link">Don't have an account? <Link to="/register">Sign up</Link></p>
    </AuthLayout>
  );
}

export default Login;
