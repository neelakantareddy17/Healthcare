import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import QueueCard from '../../components/queue/QueueCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getDoctorQueue, callNextToken, updateQueueStatus } from '../../services/queue';
import Button from '../../components/common/Button';
import { getLocalDateInputValue } from '../../utils/date';

function QueueManagement() {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    getDoctorQueue({ date: getLocalDateInputValue() }).then((q) => { setQueue(q); setLoading(false); });
  }, [user]);

  const handleNext = async () => {
    setCalling(true);
    const updated = await callNextToken({ date: getLocalDateInputValue() });
    setQueue(updated);
    setCalling(false);
  };

  const handleComplete = async (queueId) => {
    setCompleting(true);
    try {
      await updateQueueStatus(queueId, 'COMPLETED');
      setQueue(await getDoctorQueue({ date: getLocalDateInputValue() }));
    } finally {
      setCompleting(false);
    }
  };

  return (
    <DoctorLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Queue Management</h2>
      {queue.some((entry) => ['WAITING', 'IN_PROGRESS'].includes(entry.status)) && (
        <div style={{ marginBottom: 20 }}>
          <Button title={calling ? 'Calling...' : 'Call Next Patient'} onClick={handleNext} disabled={calling} />
        </div>
      )}
      {loading ? <Loader /> : queue.filter((entry) => ['WAITING', 'IN_PROGRESS'].includes(entry.status)).length === 0 ? (
        <EmptyState icon="queue" title="No patients in queue" />
      ) : (
        queue.filter((entry) => ['WAITING', 'IN_PROGRESS'].includes(entry.status)).map((q) => (
          <QueueCard
            key={q.id}
            queue={q}
            onComplete={q.status === 'IN_PROGRESS' && !completing ? () => handleComplete(q.id) : undefined}
          />
        ))
      )}
    </DoctorLayout>
  );
}

export default QueueManagement;
