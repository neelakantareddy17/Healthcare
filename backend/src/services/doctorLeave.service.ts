import { prisma } from '../config/db.js';

import { ApiError } from '../utils/ApiError.js';

import { startOfDay } from '../utils/date.js';

interface CreateLeaveInput {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  isActive: true,
};

export const createLeave = async (
  input: CreateLeaveInput,
) => {
  const startDate = startOfDay(input.startDate);
  const endDate = startOfDay(input.endDate);

  // Prevent leave overlapping with existing active appointments
  const conflicting =
    await prisma.appointment.count({
      where: {
        doctorId: input.doctorId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: [
            'PENDING',
            'PAID',
            'CHECKED_IN',
            'IN_PROGRESS',
          ],
        },
      },
    });

  if (conflicting > 0) {
    throw ApiError.badRequest(
      'Cannot mark leave: there are active appointments scheduled in this date range',
    );
  }

  return prisma.doctorLeave.create({
    data: {
      doctorId: input.doctorId,
      startDate,
      endDate,
      reason: input.reason ?? null,
      status: 'APPROVED',
    },
  });
};

export const getLeavesForDoctor = async (
  doctorId: string,
) => {
  return prisma.doctorLeave.findMany({
    where: { doctorId },
    orderBy: { startDate: 'desc' },
  });
};

export const getAllLeaves = async () => {
  return prisma.doctorLeave.findMany({
    include: {
      doctor: {
        include: {
          user: {
            select: safeUserSelect,
          },
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });
};

export const getLeaveById = async (id: string) => {
  const leave =
    await prisma.doctorLeave.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: {
              select: safeUserSelect,
            },
          },
        },
      },
    });

  if (!leave) {
    throw ApiError.notFound(
      'Leave record not found',
    );
  }

  return leave;
};

export const deleteLeave = async (
  id: string,
  doctorId: string,
  isAdmin: boolean,
) => {
  const leave = await getLeaveById(id);

  if (
    !isAdmin &&
    leave.doctorId !== doctorId
  ) {
    throw ApiError.forbidden(
      'You can only remove your own leave records',
    );
  }

  await prisma.doctorLeave.delete({
    where: { id },
  });

  return {
    message: 'Leave record removed',
  };
};