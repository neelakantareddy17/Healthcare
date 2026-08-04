import { sleep, generateToken } from '../utils/helpers';

let MOCK_APPOINTMENTS = [
  { id: 1, doctorId: 1, doctorName: 'Dr. Priya Nair', specialty: 'Cardiologist', patientId: 1, patientName: 'Arjun Sharma', date: '2026-08-10', time: '10:00 AM', status: 'Upcoming', tokenNumber: 14, qrCode: 'APT-001-2026', fee: 800 },
  { id: 2, doctorId: 2, doctorName: 'Dr. Rahul Mehta', specialty: 'Neurologist', patientId: 1, patientName: 'Arjun Sharma', date: '2026-07-20', time: '11:30 AM', status: 'Completed', tokenNumber: 7, qrCode: 'APT-002-2026', fee: 1000 },
  { id: 3, doctorId: 4, doctorName: 'Dr. Suresh Kumar', specialty: 'Orthopedic', patientId: 1, patientName: 'Arjun Sharma', date: '2026-07-05', time: '09:00 AM', status: 'Completed', tokenNumber: 22, qrCode: 'APT-003-2026', fee: 900 },
];

export const getPatientAppointments = async (patientId) => {
  await sleep(600);
  return MOCK_APPOINTMENTS.filter((a) => a.patientId === Number(patientId));
};

export const getDoctorAppointments = async (doctorId) => {
  await sleep(600);
  return MOCK_APPOINTMENTS.filter((a) => a.doctorId === Number(doctorId));
};

export const bookAppointment = async (data) => {
  await sleep(900);
  const newAppt = {
    id: Date.now(),
    ...data,
    status: 'Upcoming',
    tokenNumber: generateToken(),
    qrCode: `APT-${Date.now()}-2026`,
  };
  MOCK_APPOINTMENTS.push(newAppt);
  return newAppt;
};

export const cancelAppointment = async (id) => {
  await sleep(500);
  const appt = MOCK_APPOINTMENTS.find((a) => a.id === id);
  if (appt) appt.status = 'Cancelled';
  return appt;
};
