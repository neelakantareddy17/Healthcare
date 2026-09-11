import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data.data;
};