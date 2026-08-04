import { useEffect, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import { getPatients } from '../../services/patient';
import { getInitials } from '../../utils/helpers';
import EmptyState from '../../components/common/EmptyState';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then((p) => { setPatients(p); setLoading(false); });
  }, []);

  return (
    <DoctorLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>My Patients</h2>
      {loading ? <Loader /> : patients.length === 0 ? (
        <EmptyState icon="👥" title="No patients found" />
      ) : (
        patients.map((p) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'var(--primary)', flexShrink: 0 }}>
              {getInitials(p.name)}
            </div>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{p.age}y • {p.gender} • {p.bloodGroup}</p>
              <p style={{ fontSize: 13, color: 'var(--primary)', marginTop: 4 }}>{p.diagnosis}</p>
            </div>
            <p style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-light)' }}>Last: {p.lastVisit}</p>
          </div>
        ))
      )}
    </DoctorLayout>
  );
}

export default Patients;
