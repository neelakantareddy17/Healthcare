import AdminLayout from '../../layouts/AdminLayout';
import { getInitials } from '../../utils/helpers';

const USERS = [
  { id: 1, name: 'Arjun Sharma', role: 'Patient', email: 'patient@demo.com', status: 'Active' },
  { id: 2, name: 'Dr. Priya Nair', role: 'Doctor', email: 'doctor@demo.com', status: 'Active' },
  { id: 3, name: 'Admin User', role: 'Admin', email: 'admin@demo.com', status: 'Active' },
  { id: 4, name: 'Meena Patel', role: 'Patient', email: 'meena@demo.com', status: 'Active' },
  { id: 5, name: 'Dr. Rahul Mehta', role: 'Doctor', email: 'rahul@demo.com', status: 'Inactive' },
];

const roleColor = { Patient: '#dbeafe', Doctor: '#dcfce7', Admin: '#fef9c3' };
const roleText = { Patient: '#1d4ed8', Doctor: '#15803d', Admin: '#b45309' };

function Users() {
  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Manage Users</h2>
      {USERS.map((u) => (
        <div key={u.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 50, background: roleColor[u.role] || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: roleText[u.role] || '#374151', flexShrink: 0 }}>
            {getInitials(u.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{u.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{u.email}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 10, background: roleColor[u.role], color: roleText[u.role] }}>{u.role}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 10, background: u.status === 'Active' ? '#dcfce7' : '#fee2e2', color: u.status === 'Active' ? '#15803d' : '#dc2626' }}>{u.status}</span>
        </div>
      ))}
    </AdminLayout>
  );
}

export default Users;
