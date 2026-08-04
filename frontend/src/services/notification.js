import { sleep } from '../utils/helpers';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Appointment Confirmed', message: 'Your appointment with Dr. Priya Nair on Aug 10 at 10:00 AM is confirmed.', time: '2 hours ago', read: false, type: 'appointment' },
  { id: 2, title: 'Token Update', message: 'Current token is #10. You are next in queue!', time: '30 mins ago', read: false, type: 'queue' },
  { id: 3, title: 'Appointment Reminder', message: 'Reminder: Your appointment with Dr. Rahul Mehta is tomorrow at 11:30 AM.', time: '1 day ago', read: true, type: 'reminder' },
  { id: 4, title: 'Medical Record Added', message: 'A new prescription has been added to your medical records.', time: '3 days ago', read: true, type: 'record' },
];

export const getNotifications = async (userId) => {
  await sleep(400);
  return MOCK_NOTIFICATIONS;
};

export const markAllRead = async () => {
  await sleep(200);
  MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
  return MOCK_NOTIFICATIONS;
};
