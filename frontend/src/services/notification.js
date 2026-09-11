import api from './api';

const normalizeNotification = (notification) => ({
  ...notification,
  read: notification.isRead,
  type: notification.type?.toLowerCase() || 'notification',
  time: new Date(notification.createdAt).toLocaleString(),
});

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data.map(normalizeNotification);
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return normalizeNotification(response.data.data);
};
