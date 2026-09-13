import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

/**
 * Self-registration is only available to PATIENTS.
 * Doctors and Admins are created through the admin-only doctor management APIs
 * (or seeded directly in the database for the first admin).
 */
export const registerPatient = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw ApiError.conflict(
      'An account with this email already exists',
    );
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone ?? null,
      role: 'PATIENT',
      patient: {
        create: {
          dob: input.dob
            ? new Date(input.dob)
            : null,
          gender: input.gender ?? null,
          address: input.address ?? null,
          bloodGroup: input.bloodGroup ?? null,
          avatarId: input.avatarId ?? null,
        },
      },
    },
    include: {
      patient: true,
    },
  });

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { patient: true, doctor: true },
  });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await comparePassword(input.password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ userId: user.id, role: user.role });

  const { password, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      patient: true,
      doctor: { include: { department: true } },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const { password, ...safeUser } = user;
  return safeUser;
};
