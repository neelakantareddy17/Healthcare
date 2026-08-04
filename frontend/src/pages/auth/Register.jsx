import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/patient');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create Account 🏥</h2>
      <p className="auth-subtitle">Join MediQ AI for smarter healthcare</p>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input label="Full Name" name="name" placeholder="Arjun Sharma" value={form.name} onChange={handleChange} required icon="👤" />
        <Input label="Email Address" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required icon="📧" />
        <Input label="Phone Number" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} required icon="📱" />
        <Input label="Password" type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required icon="🔒" />
        <Button title={loading ? 'Creating account...' : 'Create Account'} type="submit" disabled={loading} />
      </form>
      <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}

export default Register;
