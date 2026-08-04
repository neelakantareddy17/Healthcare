import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../layouts/DoctorLayout';
import QueueCard from '../../components/queue/QueueCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getDoctorQueue, callNextToken } from '../../services/queue';
import Button from '../../components/common/Button';

function QueueManagement() {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    getDoctorQueue(user?.id || 2).then((q) => { setQueue(q); setLoading(false); });
  }, [user]);

  const handleNext = async () => {
    setCalling(true);
    const updated = await callNextToken(user?.id || 2);
    setQueue(updated);
    setCalling(false);
  };

  return (
    <DoctorLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Queue Management</h2>
      {queue.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Button title={calling ? 'Calling...' : '📢 Call Next Patient'} onClick={handleNext} disabled={calling} />
        </div>
      )}
      {loading ? <Loader /> : queue.length === 0 ? (
        <EmptyState icon="🎫" title="No patients in queue" />
      ) : (
        queue.map((q) => <QueueCard key={q.id} queue={q} />)
      )}
    </DoctorLayout>
  );
}

export default QueueManagement;
