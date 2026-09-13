import { useEffect, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import { getPatients } from '../../services/patient';
import PatientAvatar from '../../components/patient/PatientAvatar';
import { loadAvatarId } from '../../utils/avatar.jsx';
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
        <EmptyState icon="users" title="No patients found" />
      ) : (
        patients.map((p) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <PatientAvatar
              avatarId={loadAvatarId(p.userId)}
              name={p.name}
              size={52}
            />
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
