import api from './api';

const normalizeDoctor = (doctor) => ({
  ...doctor,
  ...(doctor.doctor ? doctor.doctor : {}),
  id: doctor.id || doctor.doctor?.id,
  name: doctor.user?.name || doctor.name || 'Doctor',
  email: doctor.user?.email || doctor.email,
  phone: doctor.user?.phone || doctor.phone,
  specialty: doctor.specialization || doctor.doctor?.specialization,
  experience: doctor.experienceYears ?? doctor.doctor?.experienceYears,
  experienceYears: doctor.experienceYears ?? doctor.doctor?.experienceYears,
  fee: doctor.consultationFee ?? doctor.doctor?.consultationFee,
  consultationFee: doctor.consultationFee ?? doctor.doctor?.consultationFee,
  departmentId: doctor.departmentId || doctor.doctor?.departmentId,
  department: doctor.department || doctor.doctor?.department,
  available: (doctor.user || doctor).isActive !== false,
  rating: null,
  reviews: null,
  about: doctor.qualification || doctor.doctor?.qualification || 'Healthcare professional',
  photo: '',
});

export const getDoctors = async (filters = {}) => {
  const response = await api.get('/doctors', {
    params: filters.departmentId ? { departmentId: filters.departmentId } : undefined,
  });

  return response.data.data.map(normalizeDoctor);
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return normalizeDoctor(response.data.data);
};

export const createDoctor = async (data) => {
  const response = await api.post('/doctors', data);
  return normalizeDoctor(response.data.data);
};

export const updateDoctor = async (id, data) => {
  const response = await api.put(`/doctors/${id}`, data);
  return normalizeDoctor(response.data.data);
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data.data;
};
