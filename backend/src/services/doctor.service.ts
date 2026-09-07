import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword } from '../utils/hash.js';

interface CreateDoctorInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  departmentId: string;
  specialization: string;
  experienceYears?: number;
  consultationFee: number;
  qualification?: string;
}

/**
 * Only an ADMIN can create a doctor account. This creates both the
 * underlying User (role = DOCTOR) and the Doctor profile in one transaction.
 */
export const createDoctor = async (input: CreateDoctorInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const department = await prisma.department.findUnique({ where: { id: input.departmentId } });
  if (!department) {
    throw ApiError.badRequest('Invalid departmentId');
  }

  const hashedPassword = await hashPassword(input.password);

 const doctor = await prisma.user.create({
 data: {
  name: input.name,
  email: input.email,
  password: hashedPassword,
  ...(input.phone !== undefined ? { phone: input.phone } : {}),
  role: 'DOCTOR',
    
    doctor: {
      create: {
        departmentId: input.departmentId,
        specialization: input.specialization,
        experienceYears: input.experienceYears ?? 0,
        consultationFee: input.consultationFee,
        ...(input.qualification !== undefined
          ? { qualification: input.qualification }
          : {}),
      },
    },
  },
  include: {
    doctor: {
      include: {
        department: true,
      },
    },
  },
});

  const { password, ...safeUser } = doctor;
  return safeUser;
};

export const getAllDoctors = async (departmentId?: string) => {
  const doctors = await prisma.doctor.findMany({
    ...(departmentId ? { where: { departmentId } } : {}),
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
      department: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return doctors;
};

export const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, isActive: true } },
      department: true,
    },
  });
  if (!doctor) {
    throw ApiError.notFound('Doctor not found');
  }
  return doctor;
};

export const getDoctorByUserId = async (userId: string) => {
  const doctor = await prisma.doctor.findUnique({
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
  department: true,
},
  });
  if (!doctor) {
    throw ApiError.notFound('Doctor profile not found');
  }
  return doctor;
};

interface UpdateDoctorInput {
  name?: string;
  phone?: string;
  departmentId?: string;
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  qualification?: string;
}

export const updateDoctor = async (id: string, data: UpdateDoctorInput) => {
  const doctor = await getDoctorById(id);

  if (data.departmentId) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) {
      throw ApiError.badRequest('Invalid departmentId');
    }
  }

 const { name, phone, ...doctorFields } = data;

if (name !== undefined || phone !== undefined) {
  await prisma.user.update({
    where: { id: doctor.userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
    },
  });
} 

 return prisma.doctor.update({
  where: { id },
  data: doctorFields,
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
    department: true,
  },
});
};

export const deleteDoctor = async (id: string) => {
  const doctor = await getDoctorById(id);
  // Cascades to doctor + related appointments/leaves/queue entries via schema onDelete rules,
  // but we deactivate the user account instead of hard-deleting to preserve appointment history.
  await prisma.user.update({ where: { id: doctor.userId }, data: { isActive: false } });
  return { message: 'Doctor account deactivated' };
};
