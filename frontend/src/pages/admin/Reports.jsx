import AdminLayout from '../../layouts/AdminLayout';
import Icon from '../../components/common/Icon';

const REPORTS = [
  { title: 'Monthly Appointments', count: 1842, trend: '+12%', icon: 'calendar', color: '#dbeafe' },
  { title: 'Patient Registrations', count: 284, trend: '+8%', icon: 'users', color: '#dcfce7' },
  { title: 'Doctor Utilization', count: '87%', trend: '+3%', icon: 'doctor', color: '#fef9c3' },
  { title: 'Revenue Generated', count: '₹4.2L', trend: '+15%', icon: 'creditCard', color: '#f3e8ff' },
  { title: 'Avg Queue Wait', count: '18 min', trend: '-5%', icon: 'clock', color: '#fee2e2' },
  { title: 'AI Recommendations', count: 562, trend: '+22%', icon: 'activity', color: '#E8FBF8' },
];

function Reports() {
  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Reports & Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {REPORTS.map((r) => (
          <div key={r.title} style={{ background: r.color, borderRadius: 20, padding: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ display: 'grid', placeItems: 'center', color: '#0B6B63' }}><Icon name={r.icon} size={26} /></span>
            <p style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 4px' }}>{r.count}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{r.title}</p>
            <p style={{ fontSize: 13, color: r.trend.startsWith('+') ? '#15803d' : '#dc2626', fontWeight: 700 }}>{r.trend} this month</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default Reports;
