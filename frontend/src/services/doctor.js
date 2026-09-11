import api from './api';

const normalizeDoctor = (doctor) => ({
  ...doctor,
  name: doctor.user?.name || 'Doctor',
  specialty: doctor.specialization,
  experience: doctor.experienceYears,
  experienceYears: doctor.experienceYears,
  fee: doctor.consultationFee,
  available: doctor.user?.isActive !== false,
  rating: null,
  reviews: null,
  about: doctor.qualification || 'Healthcare professional',
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
