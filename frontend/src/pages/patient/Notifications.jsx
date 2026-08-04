import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getNotifications, markAllRead } from '../../services/notification';
import './Notifications.css';

function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(user?.id).then((n) => { setNotifs(n); setLoading(false); });
  }, [user]);

  const handleMarkAll = async () => {
    const updated = await markAllRead();
    setNotifs(updated);
  };

  const typeIcon = { appointment: '📅', queue: '🎫', reminder: '⏰', record: '📋' };

  return (
    <PatientLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Notifications</h2>
        {notifs.some((n) => !n.read) && (
          <button className="mark-all-btn" onClick={handleMarkAll}>Mark all read</button>
        )}
      </div>
      {loading ? (
        <Loader />
      ) : notifs.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" />
      ) : (
        notifs.map((n) => (
          <div key={n.id} className={`notif-card ${!n.read ? 'notif-card--unread' : ''}`}>
            <div className="notif-card__icon">{typeIcon[n.type] || '🔔'}</div>
            <div className="notif-card__body">
              <p className="notif-card__title">{n.title}</p>
              <p className="notif-card__msg">{n.message}</p>
              <p className="notif-card__time">{n.time}</p>
            </div>
            {!n.read && <span className="notif-dot" />}
          </div>
        ))
      )}
    </PatientLayout>
  );
}

export default Notifications;
