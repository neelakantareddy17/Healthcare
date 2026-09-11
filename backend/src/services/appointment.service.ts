import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { startOfDay, endOfDay } from '../utils/date.js';
import { createNotification } from './notification.service.js';

interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason?: string;
}

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  isActive: true,
};

const assertDoctorNotOnLeave = async (doctorId: string, date: Date) => {
  const leave = await prisma.doctorLeave.findFirst({
    where: {
      doctorId,
      status: 'APPROVED',
      startDate: { lte: date },
      endDate: { gte: date },
    },
  });

  if (leave) {
    throw ApiError.badRequest('Doctor is on leave on the selected date');
  }
};

export const createAppointment = async (
  input: CreateAppointmentInput,
) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: input.doctorId },
  });

  if (!doctor) {
    throw ApiError.badRequest('Invalid doctorId');
  }

  const appointmentDay = startOfDay(input.appointmentDate);

  if (
    appointmentDay.getTime() <
    startOfDay(new Date()).getTime()
  ) {
    throw ApiError.badRequest('Cannot book an appointment in the past');
  }

  await assertDoctorNotOnLeave(
    input.doctorId,
    appointmentDay,
  );

  // Prevent the same patient from booking the same doctor,
  // date, and check-in slot more than once.
  const existingAppointment =
    await prisma.appointment.findFirst({
      where: {
        patientId: input.patientId,
        doctorId: input.doctorId,
        appointmentDate: appointmentDay,
        timeSlot: input.timeSlot,
        status: {
          not: 'CANCELLED',
        },
      },
    });

  if (existingAppointment) {
    throw ApiError.conflict(
      'You already have an appointment with this doctor for this check-in slot',
    );
  }

  // Current capacity: 5 appointments per doctor/date/slot.
  // This will be changed to 10 with concurrency protection later.
  const slotAppointmentCount =
    await prisma.appointment.count({
      where: {
        doctorId: input.doctorId,
        appointmentDate: appointmentDay,
        timeSlot: input.timeSlot,
        status: {
          not: 'CANCELLED',
        },
      },
    });

  if (slotAppointmentCount >= 5) {
    throw ApiError.conflict(
      'This check-in slot is full. Please choose another slot.',
    );
  }

  const appointment = (await prisma.appointment.create({
    data: {
      patientId: input.patientId,
      doctorId: input.doctorId,
      appointmentDate: appointmentDay,
      timeSlot: input.timeSlot,
      reason: input.reason ?? null,
      status: 'PENDING',
    },
    include: {
      doctor: {
        include: {
          user: {
            select: safeUserSelect,
          },
          department: true,
        },
      },
      patient: {
        include: {
          user: {
            select: safeUserSelect,
          },
        },
      },
    },
  })) as Awaited<
    ReturnType<typeof prisma.appointment.create>
  > & {
    patient: {
      userId: string;
    };
    doctor: {
      user: {
        name: string;
      };
    };
  };

  await createNotification({
    userId: appointment.patient.userId,
    title: 'Appointment created',
    message: `Your appointment with Dr. ${appointment.doctor.user.name} on ${appointment.appointmentDate.toDateString()} is pending payment.`,
    type: 'APPOINTMENT',
  });

  return appointment;
};

interface AppointmentFilters {
  status?: string;
  doctorId?: string;
  patientId?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export const getAppointments = async (
  filters: AppointmentFilters,
) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.date) {
    where.appointmentDate = {
      gte: startOfDay(filters.date),
      lte: endOfDay(filters.date),
    };
  }

  const [data, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          include: {
            user: {
              select: safeUserSelect,
            },
            department: true,
          },
        },
        patient: {
          include: {
            user: {
              select: safeUserSelect,
            },
          },
        },
        payment: true,
        queueEntry: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.appointment.count({
      where,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAppointmentById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: {
        include: {
          user: {
            select: safeUserSelect,
          },
          department: true,
        },
      },
      patient: {
        include: {
          user: {
            select: safeUserSelect,
          },
        },
      },
      payment: true,
      queueEntry: true,
    },
  });

  if (!appointment) {
    throw ApiError.notFound('Appointment not found');
  }

  return appointment;
};

export const cancelAppointment = async (
  id: string,
  requesterUserId: string,
  isAdmin: boolean,
) => {
  const appointment = await getAppointmentById(id);

  if (
    !isAdmin &&
    appointment.patient.userId !== requesterUserId
  ) {
    throw ApiError.forbidden(
      'You can only cancel your own appointments',
    );
  }

  if (
    appointment.status === 'COMPLETED' ||
    appointment.status === 'CANCELLED' ||
    appointment.status === 'CHECKED_IN' ||
    appointment.status === 'IN_PROGRESS'
  ) {
    throw ApiError.badRequest(
      `Cannot cancel an appointment that is already ${appointment.status}`,
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const cancelled = await tx.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    // Mark associated queue entry as skipped.
    await tx.queueEntry.updateMany({
      where: {
        appointmentId: id,
      },
      data: {
        status: 'SKIPPED',
      },
    });

    // Mark successful payment as refunded.
    await tx.payment.updateMany({
      where: {
        appointmentId: id,
        status: 'SUCCESS',
      },
      data: {
        status: 'REFUNDED',
      },
    });

    return cancelled;
  });

  await createNotification({
    userId: appointment.patient.userId,
    title: 'Appointment cancelled',
    message: `Your appointment on ${appointment.appointmentDate.toDateString()} has been cancelled.`,
    type: 'APPOINTMENT',
  });

  return updated;
};