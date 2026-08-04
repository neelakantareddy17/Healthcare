import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import { getDoctorAppointments } from '../../services/appointment';
import { getDoctorQueue, callNextToken } from '../../services/queue';
import './Dashboard.css';

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [appts, q] = await Promise.all([
        getDoctorAppointments(user?.id || 2),
        getDoctorQueue(user?.id || 2),
      ]);
      setAppointments(appts);
      setQueue(q);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleCallNext = async () => {
    setCalling(true);
    const updated = await callNextToken(user?.id || 2);
    setQueue(updated);
    setCalling(false);
  };

  const upcoming = appointments.filter((a) => a.status === 'Upcoming').length;
  const completed = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <DoctorLayout>
      <div className="doc-dashboard-banner">
        <div>
          <p className="doc-dashboard-greeting">Good morning 👋</p>
          <h2 className="doc-dashboard-name">{user?.name || 'Doctor'}</h2>
          <p className="doc-dashboard-spec">{user?.specialty || 'Specialist'}</p>
        </div>
        <div className="doc-dashboard-icon">🩺</div>
      </div>

      <div className="doc-stats-grid">
        <div className="doc-stat-card doc-stat-card--blue">
          <span className="doc-stat-card__num">{upcoming}</span>
          <span>Upcoming</span>
        </div>
        <div className="doc-stat-card doc-stat-card--green">
          <span className="doc-stat-card__num">{completed}</span>
          <span>Completed</span>
        </div>
        <div className="doc-stat-card doc-stat-card--orange">
          <span className="doc-stat-card__num">{queue.length}</span>
          <span>In Queue</span>
        </div>
        <div className="doc-stat-card doc-stat-card--purple">
          <span className="doc-stat-card__num">4.9</span>
          <span>Rating</span>
        </div>
      </div>

      <h3 className="section-title">Queue Management</h3>
      {loading ? <Loader /> : queue.length === 0 ? (
        <div className="empty-queue">No active queue today 🎉</div>
      ) : (
        <>
          <div className="queue-control">
            <div className="queue-control__current">
              <p className="queue-control__label">Now Serving</p>
              <p className="queue-control__num">#{queue[0]?.currentToken}</p>
            </div>
            <div className="queue-control__next">
              <p className="queue-control__label">In Queue</p>
              <p className="queue-control__count">{queue.length} patients</p>
            </div>
            <button className="queue-next-btn" onClick={handleCallNext} disabled={calling}>
              {calling ? '...' : 'Next ›'}
            </button>
          </div>
          <div className="queue-list">
            {queue.map((q) => (
              <div key={q.id} className="queue-list-item">
                <span>#{q.tokenNumber}</span>
                <span>{q.patientName}</span>
                <span className="queue-list-status">{q.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="section-title" style={{ marginTop: 24 }}>Today's Appointments</h3>
      {loading ? <Loader /> : appointments.slice(0, 3).map((a) => (
        <div key={a.id} className="doc-appt-item">
          <span className="doc-appt-token">#{a.tokenNumber}</span>
          <div>
            <p className="doc-appt-patient">{a.patientName}</p>
            <p className="doc-appt-time">{a.time}</p>
          </div>
          <span className={`doc-appt-status doc-appt-status--${a.status.toLowerCase()}`}>{a.status}</span>
        </div>
      ))}
    </DoctorLayout>
  );
}

export default DoctorDashboard;
