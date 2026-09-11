import api from './api';

const normalizePatient = (patient) => ({
  ...patient,
  name: patient.user?.name || 'Patient',
  email: patient.user?.email,
  phone: patient.user?.phone,
  gender: patient.gender?.toLowerCase(),
  bloodGroup: patient.bloodGroup,
});

export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data.data.map(normalizePatient);
};

export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return normalizePatient(response.data.data);
};

export const updatePatient = async (id, data) => {
  const response = await api.put(`/patients/${id}`, data);
  return normalizePatient(response.data.data);
};

export const getMedicalRecords = async () => [];
