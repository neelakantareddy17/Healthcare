import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { getPatientAppointments, cancelAppointment } from '../../services/appointment';
import { parseTimeSlotStart } from '../../utils/date';
import './Home.css';

const UPCOMING_STATUSES = ['PENDING', 'PAID', 'CHECKED_IN', 'IN_PROGRESS'];

const getAppointmentTimestamp = (appointment) => {
  const date = new Date(`${appointment.date}T00:00:00`);
  const time = parseTimeSlotStart(appointment.time);

  if (!Number.isNaN(date.getTime()) && time) {
    date.setHours(time.hours, time.minutes, 0, 0);
    return date.getTime();
  }

  return Number.MAX_SAFE_INTEGER;
};

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
        setAllAppointments(appts);
        setAppointments(appts
          .filter((appointment) => UPCOMING_STATUSES.includes(appointment.status))
          .sort((a, b) => getAppointmentTimestamp(a) - getAppointmentTimestamp(b)));
        setQueue(appts
          .filter((appointment) => appointment.queueEntry && UPCOMING_STATUSES.includes(appointment.status))
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

  const activeQueue = queue[0];

  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Patient';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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
      <div className="home-intro">
        <div>
          <p className="home-date">{today.toUpperCase()}</p>
          <h2 className="home-greeting">{greeting}, {firstName}</h2>
          <p className="home-status">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="home-status__icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Your health status is looking stable today.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : appointments.length > 0 ? (
        <section className="home-appointments" aria-labelledby="upcoming-appointments-title">
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">Your schedule</p>
              <h3 id="upcoming-appointments-title" className="section-title">Upcoming appointments</h3>
            </div>
            <span className="home-appointment-count">{appointments.length}</span>
          </div>
          <div className="home-appointment-list">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancel}
                onCheckIn={appointment.status === 'PAID'
                  ? () => navigate('/patient/checkin', { state: { appointment } })
                  : undefined}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="home-empty">
          <div className="home-empty__icon"><Icon name="calendar" size={24} /></div>
          <h3>No upcoming appointments</h3>
          <p>Your upcoming visits and queue updates will appear here.</p>
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