import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { startOfDay, endOfDay } from '../utils/date.js';
import { broadcastPatientQueueUpdate, broadcastQueueUpdate } from '../socket/queue.socket.js';
import { createNotification } from './notification.service.js';

/**
 * Creates a queue entry for a paid appointment.
 * Token numbers restart every day, per doctor: we compute the next token
 * by counting existing queue entries for that doctor on that date.
 * This is called from the payment service right after a successful payment.
 */
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  isActive: true,
};
export const createQueueEntryForAppointment = async (appointmentId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { doctor: true },
  });

  if (!appointment) {
    throw ApiError.notFound('Appointment not found');
  }

  if (appointment.status !== 'PAID') {
    throw ApiError.badRequest('Only paid appointments can receive a queue token');
  }

  const date = startOfDay(appointment.appointmentDate);

  return prisma.$transaction(async (tx) => {
    const lastToken = await tx.queueEntry.findFirst({
      where: { doctorId: appointment.doctorId, date },
      orderBy: { tokenNumber: 'desc' },
    });

    const nextToken = (lastToken?.tokenNumber ?? 0) + 1;

    const queueEntry = await tx.queueEntry.create({
      data: {
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
        tokenNumber: nextToken,
        date,
        status: 'WAITING',
      },
    });

    return queueEntry;
  });
};

export const getDoctorQueueForToday = async (
  doctorId: string,
  date?: string,
) => {
  const day = date
    ? startOfDay(date)
    : startOfDay(new Date());

  const queue = await prisma.queueEntry.findMany({
    where: {
      doctorId,
      date: {
        gte: startOfDay(day),
        lte: endOfDay(day),
      },
    },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: {
                select: safeUserSelect,
              },
            },
          },
        },
      },
    },
    orderBy: {
      tokenNumber: 'asc',
    },
  });

  return queue;
};

export const checkInAppointment = async (checkInCode: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { checkInCode },
    include: {
      queueEntry: true,
      patient: true,
      doctor: true,
    },
  });

  if (!appointment) {
    throw ApiError.notFound('Invalid check-in code');
  }

  if (appointment.status !== 'PAID') {
    throw ApiError.badRequest(
      `Appointment cannot be checked in from status ${appointment.status}. It must be PAID.`,
    );
  }

  if (appointment.queueEntry) {
    throw ApiError.conflict('Appointment has already been checked in');
  }

  const queueEntry = await createQueueEntryForAppointment(appointment.id);

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: { status: 'CHECKED_IN' },
    include: { queueEntry: true },
  });

  const snapshot = await getDoctorQueueForToday(appointment.doctorId);

  broadcastQueueUpdate(appointment.doctorId, snapshot);
  broadcastPatientQueueUpdate(appointment.patient.userId, {
    queueEntry,
    appointmentStatus: updated.status,
  });

  return {
    appointment: updated,
    queueEntry,
  };
};

export const updateQueueEntryStatus = async (
  queueEntryId: string,
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED',
  requesterUserId: string,
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN',
) => {
  const queueEntry = await prisma.queueEntry.findUnique({
    where: { id: queueEntryId },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
      doctor: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  // Only ADMIN can update any queue.
  if (
    role === 'DOCTOR' &&
    queueEntry.doctor.user.id !== requesterUserId
  ) {
    throw ApiError.forbidden(
      'You can only update your own queue',
    );
  }

  // PATIENT should never reach this function because
  // the route only allows DOCTOR and ADMIN.
  if (role === 'PATIENT') {
    throw ApiError.forbidden(
      'Patients cannot update queue status',
    );
  }

  const appointmentStatusMap: Record<
    string,
    'IN_PROGRESS' | 'COMPLETED' | undefined
  > = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
  };
  const nextAppointmentStatus = appointmentStatusMap[status];

  const updated = await prisma.$transaction(async (tx) => {
    const entry = await tx.queueEntry.update({
      where: { id: queueEntryId },
      data: { status },
    });

    if (nextAppointmentStatus) {
      await tx.appointment.update({
        where: { id: entry.appointmentId },
        data: {
          status: nextAppointmentStatus,
        },
      });
    }

    return entry;
  });

  const snapshot = await getDoctorQueueForToday(
    queueEntry.doctorId,
  );

  broadcastQueueUpdate(
    queueEntry.doctorId,
    snapshot,
  );
  broadcastPatientQueueUpdate(queueEntry.appointment.patient.userId, {
    queueEntry: updated,
    appointmentStatus: nextAppointmentStatus || queueEntry.appointment.status,
  });

  if (status === 'IN_PROGRESS') {
    await createNotification({
      userId: queueEntry.appointment.patient.userId,
      title: "It's your turn",
      message: `Your token #${queueEntry.tokenNumber} has been called. Please proceed to the consultation room.`,
      type: 'QUEUE',
    });
  }

  return updated;
};


export const getQueueEntryById = async (
  id: string,
  requesterUserId: string,
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN',
) => {
  const entry = await prisma.queueEntry.findUnique({
    where: { id },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: {
                select: safeUserSelect,
              },
            },
          },
        },
      },
      doctor: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!entry) {
    throw ApiError.notFound('Queue entry not found');
  }

  // ADMIN can view any queue entry.
  if (role === 'ADMIN') {
    return entry;
  }

  // DOCTOR can only view their own queue entries.
  if (
    role === 'DOCTOR' &&
    entry.doctor.user.id !== requesterUserId
  ) {
    throw ApiError.forbidden(
      'You can only view your own queue entries',
    );
  }

  // PATIENT can only view their own queue entries.
  if (
    role === 'PATIENT' &&
    entry.appointment.patient.userId !== requesterUserId
  ) {
    throw ApiError.forbidden(
      'You can only view your own queue entries',
    );
  }

  if (role !== 'PATIENT') {
    return entry;
  }

  const [currentEntry, patientsAhead] = await Promise.all([
    prisma.queueEntry.findFirst({
      where: {
        doctorId: entry.doctorId,
        date: entry.date,
        status: 'IN_PROGRESS',
      },
      orderBy: { tokenNumber: 'asc' },
      select: { tokenNumber: true },
    }),
    prisma.queueEntry.count({
      where: {
        doctorId: entry.doctorId,
        date: entry.date,
        tokenNumber: { lt: entry.tokenNumber },
        status: { in: ['WAITING', 'IN_PROGRESS'] },
      },
    }),
  ]);

  return {
    ...entry,
    currentToken: currentEntry?.tokenNumber ?? 0,
    patientsAhead,
  };
};
