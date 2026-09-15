import api from './api';

export const getDepartments = async () => {
  const response = await api.get('/departments');
  const departments = response.data.data;
  return Array.isArray(departments) ? departments : departments?.departments || [];
};