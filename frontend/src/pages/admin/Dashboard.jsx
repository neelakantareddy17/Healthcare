import AdminLayout from '../../layouts/AdminLayout';
import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import { getAdminDashboard } from '../../services/dashboard';
import './Dashboard.css';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(setDashboard).finally(() => setLoading(false));
  }, []);

  const stats = dashboard ? [
    { icon: 'users', label: 'Total Patients', value: dashboard.totalPatients, color: '#dbeafe', text: '#1d4ed8' },
    { icon: 'doctor', label: 'Total Doctors', value: dashboard.totalDoctors, color: '#dcfce7', text: '#15803d' },
    { icon: 'calendar', label: 'Appointments Today', value: dashboard.totalAppointmentsToday, color: '#fef9c9', text: '#b45309' },
    { icon: 'creditCard', label: 'Revenue', value: dashboard.totalRevenue, color: '#f3e8ff', text: '#7c3aed' },
  ] : [];

  return (
    <AdminLayout>
      <div className="admin-banner">
        <div>
          <p className="admin-greeting">Admin Portal 🔑</p>
          <h2 className="admin-title">MediQ AI Dashboard</h2>
          <p className="admin-subtitle">System overview and management</p>
        </div>
        <Icon name="activity" size={44} className="admin-banner__icon" />
      </div>

      {loading ? <Loader /> : <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat" style={{ background: s.color }}>
            <span className="admin-stat__icon"><Icon name={s.icon} size={22} /></span>
            <span className="admin-stat__num" style={{ color: s.text }}>{s.value.toLocaleString()}</span>
            <span className="admin-stat__label" style={{ color: s.text }}>{s.label}</span>
          </div>
        ))}
      </div>}
    </AdminLayout>
  );
}

export default AdminDashboard;
