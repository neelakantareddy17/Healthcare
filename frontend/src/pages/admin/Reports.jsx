import AdminLayout from '../../layouts/AdminLayout';

const REPORTS = [
  { title: 'Monthly Appointments', count: 1842, trend: '+12%', icon: '📅', color: '#dbeafe' },
  { title: 'Patient Registrations', count: 284, trend: '+8%', icon: '👥', color: '#dcfce7' },
  { title: 'Doctor Utilization', count: '87%', trend: '+3%', icon: '🩺', color: '#fef9c3' },
  { title: 'Revenue Generated', count: '₹4.2L', trend: '+15%', icon: '💰', color: '#f3e8ff' },
  { title: 'Avg Queue Wait', count: '18 min', trend: '-5%', icon: '⏱', color: '#fee2e2' },
  { title: 'AI Recommendations', count: 562, trend: '+22%', icon: '🤖', color: '#E8FBF8' },
];

function Reports() {
  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Reports & Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {REPORTS.map((r) => (
          <div key={r.title} style={{ background: r.color, borderRadius: 20, padding: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 28 }}>{r.icon}</span>
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
