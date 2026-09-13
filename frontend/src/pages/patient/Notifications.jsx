import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import { getNotifications, markNotificationRead } from '../../services/notification';
import './Notifications.css';

function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((notifications) => { setNotifs(notifications); setLoading(false); });
  }, [user]);

  const handleMarkAll = async () => {
    const unread = notifs.filter((notification) => !notification.read);
    const updated = await Promise.all(unread.map((notification) => markNotificationRead(notification.id)));
    const updatedById = new Map(updated.map((notification) => [notification.id, notification]));
    setNotifs((current) => current.map((notification) => updatedById.get(notification.id) || notification));
  };

  const typeIcon = { appointment: 'calendar', queue: 'queue', reminder: 'clock', record: 'clipboard' };

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
        <EmptyState icon="notification" title="No notifications" description="You are all caught up. New appointment and queue updates will appear here." />
      ) : (
        notifs.map((n) => (
          <div key={n.id} className={`notif-card ${!n.read ? 'notif-card--unread' : ''}`}>
            <div className="notif-card__icon"><Icon name={typeIcon[n.type] || 'notification'} size={19} /></div>
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
