import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllPatients = async () => {
  return prisma.patient.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, isActive: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPatientById = async (id: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, isActive: true } },
    },
  });
  if (!patient) {
    throw ApiError.notFound('Patient not found');
  }
  return patient;
};

export const getPatientByUserId = async (userId: string) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
    },
  },
},
  });
  if (!patient) {
    throw ApiError.notFound('Patient profile not found');
  }
  return patient;
};

interface UpdatePatientInput {
  name?: string;
  phone?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  bloodGroup?: string;
  avatarId?: 'sage' | 'ocean' | 'coral' | 'lavender' | 'sunrise';
}

export const updatePatient = async (id: string, data: UpdatePatientInput) => {
  const patient = await getPatientById(id);

  const { name, phone, dob, ...patientFields } = data;

  if (name !== undefined || phone !== undefined) {
    await prisma.user.update({
      where: { id: patient.userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
    });
  }

  return prisma.patient.update({
    where: { id },
    data: {
      ...patientFields,
      ...(dob !== undefined ? { dob: new Date(dob) } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
        },
      },
    },
  });
};

export const deletePatient = async (id: string) => {
  const patient = await getPatientById(id);
  await prisma.user.update({ where: { id: patient.userId }, data: { isActive: false } });
  return { message: 'Patient account deactivated' };
};
