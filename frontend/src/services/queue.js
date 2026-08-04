import { sleep } from '../utils/helpers';

let MOCK_QUEUE = [
  { id: 1, doctorId: 1, doctorName: 'Dr. Priya Nair', specialty: 'Cardiologist', patientId: 1, patientName: 'Arjun Sharma', tokenNumber: 14, currentToken: 10, status: 'Waiting', estimatedWait: '20 mins' },
];

export const getPatientQueue = async (patientId) => {
  await sleep(500);
  return MOCK_QUEUE.filter((q) => q.patientId === Number(patientId));
};

export const getDoctorQueue = async (doctorId) => {
  await sleep(500);
  return MOCK_QUEUE.filter((q) => q.doctorId === Number(doctorId));
};

export const callNextToken = async (doctorId) => {
  await sleep(400);
  const items = MOCK_QUEUE.filter((q) => q.doctorId === Number(doctorId));
  items.forEach((q) => { q.currentToken = q.currentToken + 1; });
  return items;
};
