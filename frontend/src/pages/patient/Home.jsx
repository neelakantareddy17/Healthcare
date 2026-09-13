import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import PatientAvatar from '../../components/patient/PatientAvatar';
import { usePatientAvatar } from '../../utils/avatar.jsx';
import { getPatientAppointments, cancelAppointment } from '../../services/appointment';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const appts = await getPatientAppointments();
        const upcomingStatuses = ['PENDING', 'PAID', 'CHECKED_IN', 'IN_PROGRESS'];
        setAllAppointments(appts);
        setAppointments(appts.filter((appointment) => upcomingStatuses.includes(appointment.status)));
        setQueue(appts
          .filter((appointment) => appointment.queueEntry && upcomingStatuses.includes(appointment.status))
          .map((appointment) => ({ ...appointment.queueEntry, doctorName: appointment.doctorName })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const nextAppointment = appointments[0];
  const activeQueue = queue[0];

  const navigate = useNavigate();
  const avatarId = usePatientAvatar(user?.id);
  const firstName = user?.name?.split(' ')[0] || 'Patient';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const quickActions = [
    { to: '/patient/find-doctor', label: 'Book Appointment', variant: 'teal', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ) },
    { to: '/patient/bookings', label: 'My Bookings', variant: 'teal', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ) },
    { to: '/patient/medical-records', label: 'Medical Records', variant: 'teal', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 8a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    ) },
    { to: '/patient/lab-results', label: 'Lab Results', variant: 'rose', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6.5L5.5 18a2 2 0 001.8 3h9.4a2 2 0 001.8-3L14 9.5V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    ) },
  ];

  const recentActivity = allAppointments
    .filter((appointment) => appointment.status === 'COMPLETED')
    .slice(0, 3)
    .map((appointment) => ({
      id: appointment.id,
      title: appointment.specialty || 'Completed appointment',
      meta: `${appointment.date || 'Date unavailable'} • ${appointment.doctorName}`,
    }));

  return (
    <PatientLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16 }}>
        <div>
          <p className="home-date">{today.toUpperCase()}</p>
          <h2 className="home-greeting" style={{ margin: '0 0 6px' }}>{greeting}, {firstName}</h2>
          <p className="home-status" style={{ margin: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="home-status__icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Your health status is looking stable today.
          </p>
        </div>
        <Link to="/patient/profile" title="View profile &amp; avatar" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <PatientAvatar avatarId={avatarId} name={user?.name} size={56} showRing />
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : nextAppointment ? (
        <div className="appt-card">
          <span className="appt-badge">Upcoming Appointment</span>
          <div className="appt-head">
            <div>
              <h3 className="appt-doctor">{nextAppointment.doctorName}</h3>
              <p className="appt-specialty">{nextAppointment.specialty || 'Specialty not provided'}</p>
            </div>
            {nextAppointment.doctorPhoto && (
              <img src={nextAppointment.doctorPhoto} alt={nextAppointment.doctorName} className="appt-photo" />
            )}
          </div>

          <div className="appt-details">
            <div className="appt-detail">
              <span className="appt-detail__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </span>
              <div>
                <p className="appt-detail__label">Date</p>
                <p className="appt-detail__value">{nextAppointment.date || 'Date not provided'}</p>
              </div>
            </div>
            <div className="appt-detail">
              <span className="appt-detail__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11.5A7 7 0 105 9.5C5 14.7 12 21 12 21z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" /></svg>
              </span>
              <div>
                <p className="appt-detail__label">Location</p>
                <p className="appt-detail__value">{nextAppointment.location || 'Location not provided'}</p>
              </div>
            </div>
          </div>

          <div className="appt-actions">
            {nextAppointment.status === 'PAID' && (
              <button
                className="appt-checkin"
                type="button"
                onClick={() => navigate('/patient/checkin', { state: { appointment: nextAppointment } })}
              >
                Check-in
              </button>
            )}
            <button className="appt-directions" type="button" aria-label="Get directions">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11l17-8-8 17-2-7-7-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="home-empty">
          <div className="home-empty__icon"><Icon name="calendar" size={24} /></div>
          <h3>No upcoming appointments</h3>
          <p>Keep your care on track by booking your next visit.</p>
          <Link to="/patient/find-doctor" className="home-book-btn">Book an Appointment</Link>
        </div>
      )}

      {activeQueue && (
        <div className="queue-banner">
          <div className="queue-banner__count">
            {Math.max((activeQueue.tokenNumber || 0) - (activeQueue.currentToken || 0), 0)}
            <span className="queue-banner__dot" />
          </div>
          <div className="queue-banner__text">
            <p className="queue-banner__title">Live Queue Status</p>
            <p className="queue-banner__sub">
              {Math.max((activeQueue.tokenNumber || 0) - (activeQueue.currentToken || 0), 0)} patients ahead of you
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="queue-banner__icon">
            <path d="M6 3h12M6 21h12M8 3c0 4 2 5.5 4 6.5m0 0c2 1 4 2.5 4 6.5M16 3c0 4-2 5.5-4 6.5m0 0c-2 1-4 2.5-4 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className="quick-grid">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to} className="quick-tile">
            <span className={`quick-tile__icon quick-tile__icon--${a.variant}`}>{a.icon}</span>
            <span className="quick-tile__label">{a.label}</span>
          </Link>
        ))}
      </div>

      {recentActivity.length > 0 && <>
        <div className="activity-head">
          <h3 className="section-title">Recent Activity</h3>
          <Link to="/patient/medical-records" className="activity-viewall">View All</Link>
        </div>
        <div className="activity-list">
          {recentActivity.map((item) => (
          <div key={item.id} className="activity-item">
            <span className="activity-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </span>
            <div className="activity-item__body">
              <p className="activity-item__title">{item.title}</p>
              <p className="activity-item__meta">{item.meta}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="activity-item__chevron"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          ))}
        </div>
      </>}
    </PatientLayout>
  );
}

export default Home;