import AdminLayout from '../../layouts/AdminLayout';
import './Dashboard.css';

const STATS = [
  { icon: '👥', label: 'Total Patients', value: 1284, color: '#dbeafe', text: '#1d4ed8' },
  { icon: '🩺', label: 'Total Doctors', value: 48, color: '#dcfce7', text: '#15803d' },
  { icon: '📅', label: 'Appointments Today', value: 236, color: '#fef9c3', text: '#b45309' },
  { icon: '🎫', label: 'Queue Active', value: 32, color: '#f3e8ff', text: '#7c3aed' },
];

const RECENT_ACTIVITY = [
  { time: '10:24 AM', action: 'New patient registered', user: 'Meena Patel', type: 'patient' },
  { time: '10:10 AM', action: 'Appointment booked', user: 'Arjun Sharma → Dr. Priya', type: 'appointment' },
  { time: '09:55 AM', action: 'Doctor joined', user: 'Dr. Suresh Kumar', type: 'doctor' },
  { time: '09:30 AM', action: 'Report generated', user: 'Admin', type: 'report' },
];

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="admin-banner">
        <div>
          <p className="admin-greeting">Admin Portal 🔑</p>
          <h2 className="admin-title">MediQ AI Dashboard</h2>
          <p className="admin-subtitle">System overview and management</p>
        </div>
        <div style={{ fontSize: 52 }}>📊</div>
      </div>

      <div className="admin-stats">
        {STATS.map((s) => (
          <div key={s.label} className="admin-stat" style={{ background: s.color }}>
            <span className="admin-stat__icon">{s.icon}</span>
            <span className="admin-stat__num" style={{ color: s.text }}>{s.value.toLocaleString()}</span>
            <span className="admin-stat__label" style={{ color: s.text }}>{s.label}</span>
          </div>
        ))}
      </div>

      <h3 className="admin-section">Recent Activity</h3>
      <div className="activity-list">
        {RECENT_ACTIVITY.map((a, i) => (
          <div key={i} className="activity-item">
            <span className="activity-time">{a.time}</span>
            <div>
              <p className="activity-action">{a.action}</p>
              <p className="activity-user">{a.user}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="admin-section">System Health</h3>
      <div className="health-grid">
        {[{ label: 'API Response', val: 98 }, { label: 'DB Uptime', val: 100 }, { label: 'Queue System', val: 95 }, { label: 'AI Engine', val: 99 }].map((h) => (
          <div key={h.label} className="health-card">
            <div className="health-bar-wrap">
              <div className="health-bar" style={{ width: `${h.val}%` }} />
            </div>
            <p className="health-label">{h.label}</p>
            <p className="health-val">{h.val}%</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
