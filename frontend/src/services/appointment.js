import api from './api';

const statusLabels = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CHECKED_IN: 'Checked In',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const normalizeAppointment = (appointment) => ({
  ...appointment,
  doctorName: appointment.doctor?.user?.name || 'Doctor',
  specialty: appointment.doctor?.specialization || appointment.doctor?.department?.name || '',
  date: appointment.appointmentDate,
  time: appointment.timeSlot,
  status: appointment.status,
  statusLabel: statusLabels[appointment.status] || appointment.status,
  fee: appointment.doctor?.consultationFee,
  checkInCode: appointment.checkInCode || appointment.payment?.checkInCode || null,
});

const extractAppointmentList = (response) => {
  const result = response.data.data;
  return (result?.data || []).map(normalizeAppointment);
};

export const getPatientAppointments = async () => {
  const response = await api.get('/appointments');
  return extractAppointmentList(response);
};

export const getDoctorAppointments = async (doctorId, params = {}) => {
  const response = await api.get('/appointments', {
    params: { doctorId, ...params },
  });
  return extractAppointmentList(response);
};

export const bookAppointment = async ({ doctorId, appointmentDate, timeSlot, reason }) => {
  const response = await api.post('/appointments', {
    doctorId,
    appointmentDate,
    timeSlot,
    ...(reason ? { reason } : {}),
  });
  return normalizeAppointment(response.data.data);
};

export const cancelAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return normalizeAppointment(response.data.data);
};
