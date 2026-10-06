import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getAdminDashboard } from '../../services/dashboard';
import './Reports.css';

function Reports() {
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then((dashboard) => setAppointmentStatuses(dashboard.appointmentsByStatus || []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Analytics could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const appointmentTotal = appointmentStatuses.reduce(
    (total, status) => total + (status._count?.status || 0),
    0,
  );

  return (
    <AdminLayout>
      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <h2 className="admin-page-title">Analytics</h2>
            <p className="admin-page-subtitle">Insights from the appointment data currently available.</p>
          </div>
        </div>
        {loading ? <Loader /> : error ? (
          <div className="admin-feedback" role="alert">{error}</div>
        ) : appointmentTotal ? (
          <section className="admin-analytics-card admin-card" aria-labelledby="appointment-status-title">
            <div className="admin-analytics-card__header">
              <div>
                <h3 id="appointment-status-title">Appointment status</h3>
                <p>All recorded appointments</p>
              </div>
              <span className="admin-analytics-card__total">{appointmentTotal.toLocaleString()}</span>
            </div>
            <div className="admin-analytics-status-list">
              {appointmentStatuses.map((status) => {
                const count = status._count?.status || 0;
                const percentage = Math.round((count / appointmentTotal) * 100);
                const label = status.status.replaceAll('_', ' ').toLowerCase();

                return (
                  <div className="admin-analytics-status" key={status.status}>
                    <div className="admin-analytics-status__label">
                      <span>{label}</span>
                      <strong>{count.toLocaleString()} <span>({percentage}%)</span></strong>
                    </div>
                    <div className="admin-analytics-status__track" aria-label={`${label}: ${percentage}%`}>
                      <span style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <EmptyState
            icon="activity"
            title="No analytics data yet"
            description="Appointment insights will appear here when appointments are recorded."
          />
        )}
      </section>
    </AdminLayout>
  );
}

export default Reports;
