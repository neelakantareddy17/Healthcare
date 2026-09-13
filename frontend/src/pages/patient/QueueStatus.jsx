import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getPatientAppointments } from '../../services/appointment';
import { getPatientQueue } from '../../services/queue';
import { createQueueSocket } from '../../services/socket';
import './QueueStatus.css';

const statusLabels = {
  WAITING: 'Waiting',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
};

function QueueStatus() {
  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let socket;

    const loadQueue = async (knownAppointments) => {
      const appointments = knownAppointments || await getPatientAppointments();
      const appointment = queueId
        ? appointments.find((item) => item.queueEntry?.id === queueId)
        : appointments.find((item) => item.queueEntry && ['CHECKED_IN', 'IN_PROGRESS'].includes(item.status));
      const selectedQueueId = queueId || appointment?.queueEntry?.id;

      if (!selectedQueueId) {
        if (active) setQueue(null);
        return;
      }

      const entry = await getPatientQueue(selectedQueueId);
      if (!active) return;

      if (['COMPLETED', 'SKIPPED'].includes(entry.status)) {
        setQueue(null);
        return;
      }

      setQueue(entry);
      const doctorId = appointment?.doctorId || entry.doctorId;
      setDoctor(appointment ? {
        name: appointment.doctorName,
        specialty: appointment.specialty,
        id: doctorId,
      } : { name: 'Your doctor', specialty: 'Queue', id: doctorId });

      if (doctorId && !socket) {
        socket = createQueueSocket();
        socket.on('queue:update', () => loadQueue());
      }
    };

    loadQueue().catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || 'Unable to load queue status.');
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      socket?.disconnect();
    };
  }, [queueId]);

  if (loading) return <PatientLayout><Loader /></PatientLayout>;
  if (error) return <PatientLayout><p role="alert">{error}</p></PatientLayout>;
  if (!queue) return <PatientLayout><EmptyState icon="queue" title="No active queue" description="Your queue status will appear after you check in." /></PatientLayout>;

  const status = statusLabels[queue.status] || queue.status;
  const currentToken = queue.currentToken || 0;
  const patientsAhead = queue.patientsAhead || 0;

  return (
    <PatientLayout>
      <p className="qs-eyebrow">Live Status</p>
      <h2 className="qs-title">{queue.status === 'IN_PROGRESS' ? 'Now Serving' : 'Queue Status'}</h2>

      <div className="qs-token-orbit">
        <div className="qs-token-card">
          <p className="qs-token-number">#{queue.tokenNumber}</p>
          <p className="qs-token-label">{status}</p>
        </div>
      </div>

      <div className="qs-stat-row">
        <div className="qs-stat-card">
          <p className="qs-stat-head">Your Token</p>
          <p className="qs-stat-value">#{queue.tokenNumber}</p>
          <span className="qs-pill qs-pill--lavender">{status}</span>
        </div>
        <div className="qs-stat-card">
          <p className="qs-stat-head">Ahead</p>
          <p className="qs-stat-value">{String(patientsAhead).padStart(2, '0')} <span className="qs-stat-unit">patients</span></p>
          <span className="qs-pill qs-pill--mint">Current: #{currentToken || '-'}</span>
        </div>
      </div>

      <div className="qs-doctor-card">
        <div className="qs-doctor-head">
          <div className="qs-doctor-photo qs-doctor-photo--placeholder" />
          <div>
            <h3 className="qs-doctor-name">{doctor?.name || 'Your doctor'}</h3>
            <p className="qs-doctor-specialty">{doctor?.specialty || 'Queue'}</p>
          </div>
        </div>
      </div>

      <div className="qs-list-head">
        <h3 className="section-title">Queue Status</h3>
        <span className="qs-updated">Live</span>
      </div>
      <div className="qs-queue-item qs-queue-item--current">
        <div className="qs-queue-token qs-queue-token--current">#{queue.tokenNumber}</div>
        <div className="qs-queue-body">
          <p className="qs-queue-status">{status}</p>
          <p className="qs-queue-note">{patientsAhead} patients ahead</p>
        </div>
      </div>
    </PatientLayout>
  );
}

export default QueueStatus;