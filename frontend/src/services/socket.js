import { io } from 'socket.io-client';
import { getToken } from '../utils/token';

const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export const createQueueSocket = () => io(socketUrl, {
  auth: { token: getToken() },
});