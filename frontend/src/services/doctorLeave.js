import api from './api';

export const getDoctorLeaves = async () => {
  const response = await api.get('/doctor-leaves');
  return response.data.data;
};

export const createDoctorLeave = async ({ startDate, endDate, reason }) => {
  const response = await api.post('/doctor-leaves', {
    startDate,
    endDate,
    ...(reason ? { reason } : {}),
  });
  return response.data.data;
};

export const deleteDoctorLeave = async (id) => {
  const response = await api.delete(`/doctor-leaves/${id}`);
  return response.data.data;
};