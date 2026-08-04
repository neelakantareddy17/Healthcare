import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getPatients } from '../../services/patient';
import { getInitials } from '../../utils/helpers';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPatients().then((p) => { setPatients(p); setLoading(false); }); }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Manage Patients</h2>
      {loading ? <Loader /> : patients.map((p) => (
        <div key={p.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#7c3aed', flexShrink: 0 }}>
            {getInitials(p.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{p.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{p.age}y • {p.gender} • {p.bloodGroup}</p>
            <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>{p.diagnosis}</p>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'right' }}>Last<br/>{p.lastVisit}</p>
        </div>
      ))}
    </AdminLayout>
  );
}

export default Patients;
