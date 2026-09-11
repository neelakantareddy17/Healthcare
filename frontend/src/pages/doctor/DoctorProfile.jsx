import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import { getDoctorById } from '../../services/doctor';
import { getInitials } from '../../utils/helpers';

function DoctorProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user?.doctor?.id) {
        if (active) {
          setError('Doctor profile is unavailable.');
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await getDoctorById(user.doctor.id);
        if (active) setDoctor(profile);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load doctor profile.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => { active = false; };
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <DoctorLayout><Loader /></DoctorLayout>;
  if (error) return <DoctorLayout><p role="alert">{error}</p></DoctorLayout>;

  return (
    <DoctorLayout>
      <div style={{ background: 'linear-gradient(135deg, #0B6B63, #068072)', borderRadius: 24, padding: 28, textAlign: 'center', color: '#fff', marginBottom: 16 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.4)' }}>
          {getInitials(doctor?.name)}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{doctor?.name}</h2>
        <p style={{ opacity: 0.85, marginBottom: 4 }}>{doctor?.specialty}</p>
        <p style={{ opacity: 0.75, fontSize: 14 }}>{doctor?.user?.email}</p>
        <p style={{ opacity: 0.75, fontSize: 14 }}>{doctor?.user?.phone || 'Phone not provided'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Department', value: doctor?.department?.name || 'Not provided' },
          { label: 'Experience', value: `${doctor?.experienceYears ?? 0} yrs` },
          { label: 'Consultation Fee', value: `₹${doctor?.fee ?? 0}` },
          { label: 'Qualification', value: doctor?.qualification || 'Not provided' },
        ].map((s) => (
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
