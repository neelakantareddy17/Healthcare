import api from './api';

export const payForAppointment = async (appointmentId, method = 'CARD') => {
  const response = await api.post(`/payments/${appointmentId}/pay`, { method });
  const result = response.data.data;
  sessionStorage.setItem(`mediq_payment_${appointmentId}`, JSON.stringify(result));
  return result;
};

export const getStoredPayment = (appointmentId) => {
  if (!appointmentId) return null;

  try {
    const stored = sessionStorage.getItem(`mediq_payment_${appointmentId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
