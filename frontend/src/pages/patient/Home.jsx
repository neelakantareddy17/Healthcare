import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import Loader from '../../components/common/Loader';
import { getPatientAppointments, cancelAppointment } from '../../services/appointment';
import { getPatientQueue } from '../../services/queue';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [appts, q] = await Promise.all([
          getPatientAppointments(user?.id || 1),
          getPatientQueue(user?.id || 1),
        ]);
        setAppointments(appts.filter((a) => a.status === 'Upcoming'));
        setQueue(q);
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

  const quickActions = [
    { to: '/patient/find-doctor', icon: '🔍', label: 'Find Doctor' },
    { to: '/patient/queue', icon: '🎫', label: 'My Queue' },
    { to: '/patient/medical-records', icon: '📋', label: 'Records' },
    { to: '/patient/notifications', icon: '🔔', label: 'Alerts' },
  ];

  return (
    <PatientLayout>
      {/* Greeting Banner */}
      <div className="home-banner">
        <div>
          <p className="home-greeting">Good morning 👋</p>
          <h2 className="home-username">{user?.name?.split(' ')[0] || 'Patient'}</h2>
          <p className="home-tagline">How are you feeling today?</p>
        </div>
        <div className="home-banner__icon">🏥</div>
      </div>

      {/* AI Insight */}
      <div className="ai-insight">
        <span className="ai-insight__icon">🤖</span>
        <div>
          <p className="ai-insight__title">AI Health Tip</p>
          <p className="ai-insight__text">Stay hydrated! Drink at least 8 glasses of water daily for optimal health.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to} className="quick-action">
            <span className="quick-action__icon">{a.icon}</span>
            <span className="quick-action__label">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Queue Status */}
      {queue.length > 0 && (
        <>
          <h3 className="section-title">Live Queue Status</h3>
          <div className="live-queue">
            {queue.map((q) => (
              <div key={q.id} className="live-queue-item">
                <div>
                  <p className="live-queue__doctor">{q.doctorName}</p>
                  <p className="live-queue__wait">{q.estimatedWait} wait</p>
                </div>
                <div className="live-queue__token">
                  <p className="live-queue__now">Now: #{q.currentToken}</p>
                  <p className="live-queue__yours">Yours: #{q.tokenNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upcoming Appointments */}
      <h3 className="section-title">Upcoming Appointments</h3>
      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <div className="home-empty">
          <p>📅 No upcoming appointments</p>
          <Link to="/patient/find-doctor" className="home-book-btn">Book an Appointment</Link>
        </div>
      ) : (
        appointments.map((a) => (
          <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} />
        ))
      )}
    </PatientLayout>
  );
}

export default Home;
