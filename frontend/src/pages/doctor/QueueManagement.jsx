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
  const [queueActionError, setQueueActionError] = useState('');

  useEffect(() => {
    getDoctorQueue({ date: getLocalDateInputValue() }).then((q) => { setQueue(q); setLoading(false); });
  }, [user]);

  const handleNext = async () => {
    if (calling || !queue.some((entry) => entry.status === 'WAITING')) return;

    setCalling(true);
    setQueueActionError('');
    try {
      const updated = await callNextToken({ date: getLocalDateInputValue() });
      setQueue(updated);
    } catch (requestError) {
      setQueueActionError(
        requestError.response?.data?.message || 'Unable to call the next patient.',
      );
    } finally {
      setCalling(false);
    }
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
          <Button
            title={calling ? 'Calling...' : 'Call Next Patient'}
            onClick={handleNext}
            disabled={calling || !queue.some((entry) => entry.status === 'WAITING')}
          />
          {queueActionError && (
            <p
              role="alert"
              style={{ color: '#b42318', fontSize: 13, fontWeight: 600, marginTop: 8 }}
            >
              {queueActionError}
            </p>
          )}
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
