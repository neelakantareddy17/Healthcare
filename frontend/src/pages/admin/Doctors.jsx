import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getDoctors } from '../../services/doctor';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import { getInitials } from '../../utils/helpers';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDoctors().then((d) => { setDoctors(d); setLoading(false); }); }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Manage Doctors</h2>
      {loading ? <Loader /> : doctors.map((d) => (
        <div key={d.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}>
            {getInitials(d.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{d.name}</p>
            <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 2 }}>{d.specialty}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="star" size={13} /> {d.rating} • {d.hospital}</p>
          </div>
          <Badge label={d.available ? 'Active' : 'Inactive'} type={d.available ? 'success' : 'danger'} />
        </div>
      ))}
    </AdminLayout>
  );
}

export default Doctors;
