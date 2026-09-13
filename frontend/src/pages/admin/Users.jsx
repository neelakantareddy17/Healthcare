import AdminLayout from '../../layouts/AdminLayout';
import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';
import { getPatients } from '../../services/patient';
import { getInitials } from '../../utils/helpers';

const roleColor = { Patient: '#dbeafe', Doctor: '#dcfce7', Admin: '#fef9c3' };
const roleText = { Patient: '#1d4ed8', Doctor: '#15803d', Admin: '#b45309' };

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then(setUsers).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Manage Users</h2>
      {loading ? <Loader /> : users.map((u) => (
        <div key={u.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 50, background: roleColor.Patient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: roleText.Patient, flexShrink: 0 }}>
            {getInitials(u.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{u.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{u.email}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 10, background: roleColor.Patient, color: roleText.Patient }}>Patient</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 10, background: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#15803d' : '#dc2626' }}>{u.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      ))}
    </AdminLayout>
  );
}

export default Users;
