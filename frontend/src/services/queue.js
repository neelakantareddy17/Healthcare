import api from './api';

const normalizeQueue = (entries) => {
  const currentToken = entries.find((entry) => entry.status === 'IN_PROGRESS')?.tokenNumber || 0;
  const statusPriority = { COMPLETED: 0, IN_PROGRESS: 1, WAITING: 2, SKIPPED: 3 };
  const normalized = entries.map((entry) => ({
    ...entry,
    patientName: entry.appointment?.patient?.user?.name || 'Patient',
    symptoms: entry.appointment?.reason || '',
    doctorName: 'Your queue',
    specialty: '',
    currentToken,
    estimatedWait: null,
  }));

  return normalized.sort((left, right) => {
    const priorityDifference = statusPriority[left.status] - statusPriority[right.status];
    if (priorityDifference !== 0) return priorityDifference;

    if (left.status === 'COMPLETED') {
      return new Date(right.updatedAt) - new Date(left.updatedAt);
    }

    if (left.status === 'IN_PROGRESS') {
      return new Date(right.updatedAt) - new Date(left.updatedAt);
    }

    return left.tokenNumber - right.tokenNumber;
  });
};

export const getPatientQueue = async (queueId) => {
  if (!queueId) return null;
  const response = await api.get(`/queue/${queueId}`);
  return response.data.data;
};

export const getDoctorQueue = async (params = {}) => {
  const response = await api.get('/queue/my-queue', { params });
  return normalizeQueue(response.data.data);
};

export const updateQueueStatus = async (id, status) => {
  const response = await api.put(`/queue/${id}/status`, { status });
  return response.data.data;
};

export const callNextToken = async (params = {}) => {
  const queue = await getDoctorQueue(params);
  if (queue.some((entry) => entry.status === 'IN_PROGRESS')) return queue;
  const next = queue.find((entry) => entry.status === 'WAITING');
  if (!next) return queue;
  await updateQueueStatus(next.id, 'IN_PROGRESS');
  return getDoctorQueue(params);
};

export const checkIn = async (checkInCode) => {
  const response = await api.post('/queue/check-in', { checkInCode });
  return response.data.data;
};
