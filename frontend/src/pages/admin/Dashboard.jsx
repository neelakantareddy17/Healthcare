import AdminLayout from '../../layouts/AdminLayout';
import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import EmptyState from '../../components/common/EmptyState';
import { getAdminDashboard } from '../../services/dashboard';
import './Dashboard.css';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.response?.data?.message || 'Dashboard information could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = dashboard ? [
    { icon: 'users', label: 'Total Patients', value: dashboard.totalPatients },
    { icon: 'doctor', label: 'Total Doctors', value: dashboard.totalDoctors },
    { icon: 'calendar', label: 'Appointments Today', value: dashboard.totalAppointmentsToday },
  ] : [];

  return (
    <AdminLayout>
      <section className="admin-page">
        <div className="admin-page-header admin-dashboard__welcome">
          <div>
            <h2 className="admin-page-title">Good morning, Admin</h2>
            <p className="admin-page-subtitle">Here&apos;s what&apos;s happening today.</p>
          </div>
        </div>

        {loading ? <Loader /> : error ? (
          <EmptyState icon="alert" title="Dashboard unavailable" description={error} />
        ) : (
          <div className="admin-stats">
            {stats.map((stat) => (
              <article className="admin-stat admin-card" key={stat.label}>
                <span className="admin-stat__icon"><Icon name={stat.icon} size={19} /></span>
                <div>
                  <p className="admin-stat__label">{stat.label}</p>
                  <p className="admin-stat__value">{Number(stat.value || 0).toLocaleString()}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
