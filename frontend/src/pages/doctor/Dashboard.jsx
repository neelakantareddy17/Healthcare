import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import { getDoctorAppointments } from '../../services/appointment';
import { getDoctorQueue, callNextToken, updateQueueStatus } from '../../services/queue';
import { getLocalDateInputValue } from '../../utils/date';
import './Dashboard.css';

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [appts, q] = await Promise.all([
        getDoctorAppointments(undefined, { date: getLocalDateInputValue() }),
        getDoctorQueue({ date: getLocalDateInputValue() }),
      ]);
      setAppointments(appts);
      setQueue(q);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleCallNext = async () => {
    setCalling(true);
    const updated = await callNextToken({ date: getLocalDateInputValue() });
    setQueue(updated);
    setCalling(false);
  };

  const handleComplete = async () => {
    const current = queue.find((entry) => entry.status === 'IN_PROGRESS');
    if (!current) return;
    setCompleting(true);
    try {
      await updateQueueStatus(current.id, 'COMPLETED');
      const [updatedQueue, updatedAppointments] = await Promise.all([
        getDoctorQueue({ date: getLocalDateInputValue() }),
        getDoctorAppointments(undefined, { date: getLocalDateInputValue() }),
      ]);
      setQueue(updatedQueue);
      setAppointments(updatedAppointments);
    } finally {
      setCompleting(false);
    }
  };

  const upcoming = appointments.filter((a) => ['PENDING', 'PAID', 'CHECKED_IN', 'IN_PROGRESS'].includes(a.status)).length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const inQueue = queue.filter((entry) => ['WAITING', 'IN_PROGRESS'].includes(entry.status)).length;
  const activeQueue = queue.filter((entry) => ['WAITING', 'IN_PROGRESS'].includes(entry.status));

  return (
    <DoctorLayout>
      <div className="doc-dashboard-banner">
        <div>
          <p className="doc-dashboard-greeting">Good morning</p>
          <h2 className="doc-dashboard-name">{user?.name || 'Doctor'}</h2>
          <p className="doc-dashboard-spec">{user?.specialty || 'Specialist'}</p>
        </div>
        <div className="doc-dashboard-icon"><Icon name="doctor" size={30} /></div>
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
          <span className="doc-stat-card__num">{inQueue}</span>
          <span>In Queue</span>
        </div>
        <div className="doc-stat-card doc-stat-card--purple">
          <span className="doc-stat-card__num">4.9</span>
          <span>Rating</span>
        </div>
      </div>

      <h3 className="section-title">Queue Management</h3>
      {loading ? <Loader /> : activeQueue.length === 0 ? (
        <div className="empty-queue"><Icon name="queue" size={20} /> No active queue today</div>
      ) : (
        <>
          <div className="queue-control">
            <div className="queue-control__current">
              <p className="queue-control__label">Now Serving</p>
              <p className="queue-control__num">#{activeQueue.find((entry) => entry.status === 'IN_PROGRESS')?.tokenNumber || '-'}</p>
            </div>
            <div className="queue-control__next">
              <p className="queue-control__label">In Queue</p>
              <p className="queue-control__count">{inQueue} patients</p>
            </div>
            <button className="queue-next-btn" onClick={handleCallNext} disabled={calling}>
              {calling ? '...' : 'Next ›'}
            </button>
            {queue.some((entry) => entry.status === 'IN_PROGRESS') && (
              <button className="queue-next-btn" onClick={handleComplete} disabled={completing}>
                {completing ? '...' : 'Complete'}
              </button>
            )}
          </div>
          <div className="queue-list">
            {activeQueue.map((q) => (
              <div key={q.id} className="queue-list-item">
                <span>#{q.tokenNumber}</span>
                <span>{q.patientName}</span>
                <span>{q.symptoms || 'No symptoms provided'}</span>
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
