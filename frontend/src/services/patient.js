import { sleep } from '../utils/helpers';

const MOCK_PATIENTS = [
  { id: 1, name: 'Arjun Sharma', age: 28, gender: 'Male', phone: '+91 9876543210', email: 'patient@demo.com', bloodGroup: 'O+', lastVisit: '2026-07-20', diagnosis: 'Hypertension' },
  { id: 2, name: 'Meena Patel', age: 45, gender: 'Female', phone: '+91 9876543215', email: 'meena@demo.com', bloodGroup: 'A+', lastVisit: '2026-07-18', diagnosis: 'Diabetes Type 2' },
  { id: 3, name: 'Ravi Kumar', age: 62, gender: 'Male', phone: '+91 9876543216', email: 'ravi@demo.com', bloodGroup: 'B-', lastVisit: '2026-07-15', diagnosis: 'Arthritis' },
];

const MOCK_RECORDS = [
  { id: 1, patientId: 1, title: 'ECG Report', date: '2026-07-20', doctor: 'Dr. Priya Nair', type: 'Report', notes: 'Normal sinus rhythm. No abnormalities detected.' },
  { id: 2, patientId: 1, title: 'Prescription', date: '2026-07-20', doctor: 'Dr. Rahul Mehta', type: 'Prescription', notes: 'Amlodipine 5mg - 1 tablet daily. Follow up in 4 weeks.' },
  { id: 3, patientId: 1, title: 'Blood Test', date: '2026-07-05', doctor: 'Dr. Suresh Kumar', type: 'Lab Report', notes: 'CBC normal. HbA1c: 5.4%. Vitamin D: 32 ng/mL.' },
];

export const getPatients = async () => {
  await sleep(500);
  return MOCK_PATIENTS;
};

export const getPatientById = async (id) => {
  await sleep(300);
  return MOCK_PATIENTS.find((p) => p.id === Number(id)) || null;
};

export const getMedicalRecords = async (patientId) => {
  await sleep(500);
  return MOCK_RECORDS.filter((r) => r.patientId === Number(patientId));
};
