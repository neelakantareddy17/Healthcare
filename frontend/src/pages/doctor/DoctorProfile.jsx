import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import { getInitials } from '../../utils/helpers';

function DoctorProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <DoctorLayout>
      <div style={{ background: 'linear-gradient(135deg, #0B6B63, #068072)', borderRadius: 24, padding: 28, textAlign: 'center', color: '#fff', marginBottom: 16 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.4)' }}>
          {getInitials(user?.name)}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user?.name}</h2>
        <p style={{ opacity: 0.85, marginBottom: 4 }}>{user?.specialty || 'Specialist'}</p>
        <p style={{ opacity: 0.75, fontSize: 14 }}>{user?.email}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[{ label: 'Patients Today', value: 8 }, { label: 'Total Patients', value: 284 }, { label: 'Rating', value: '4.9 ⭐' }, { label: 'Experience', value: '12 yrs' }].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '16px 12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <button onClick={handleLogout} style={{ width: '100%', padding: 16, borderRadius: 16, background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
        🚪 Sign Out
      </button>
    </DoctorLayout>
  );
}

export default DoctorProfile;
