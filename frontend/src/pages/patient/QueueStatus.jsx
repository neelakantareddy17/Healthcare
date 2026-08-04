import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import QueueCard from '../../components/queue/QueueCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getPatientQueue } from '../../services/queue';
import './QueueStatus.css';

function QueueStatus() {
  const { user } = useAuth();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientQueue(user?.id || 1).then((q) => { setQueues(q); setLoading(false); });
    const interval = setInterval(() => {
      getPatientQueue(user?.id || 1).then(setQueues);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <PatientLayout>
      <h2 className="page-title">Queue Status</h2>
      <div className="queue-refresh-hint">🔄 Auto-refreshes every 30 seconds</div>
      {loading ? (
        <Loader />
      ) : queues.length === 0 ? (
        <EmptyState icon="🎫" title="No active queues" description="Book an appointment to join a queue" />
      ) : (
        queues.map((q) => <QueueCard key={q.id} queue={q} />)
      )}
    </PatientLayout>
  );
}

export default QueueStatus;
