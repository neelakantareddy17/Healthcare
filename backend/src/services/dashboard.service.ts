import { prisma } from '../config/db.js';
import { startOfDay, endOfDay } from '../utils/date.js';
import { getDoctorByUserId } from './doctor.service.js';
import { getPatientByUserId } from './patient.service.js';

export const getAdminDashboard = async () => {
  const today = new Date();

  const [
    totalPatients,
    totalDoctors,
    totalDepartments,
    totalAppointmentsToday,
    totalRevenue,
    appointmentsByStatus,
    upcomingLeaves,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.department.count(),
    prisma.appointment.count({
      where: { appointmentDate: { gte: startOfDay(today), lte: endOfDay(today) } },
    }),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    }),
    prisma.appointment.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.doctorLeave.findMany({
      where: { startDate: { gte: startOfDay(today) } },
      include: { doctor: { include: { user: true } } },
      orderBy: { startDate: 'asc' },
      take: 5,
    }),
  ]);

  return {
    totalPatients,
    totalDoctors,
    totalDepartments,
    totalAppointmentsToday,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    appointmentsByStatus,
    upcomingLeaves,
  };
};

export const getDoctorDashboard = async (userId: string) => {
  const doctor = await getDoctorByUserId(userId);
  const today = new Date();

  const [todaysQueue, totalPatientsSeen, upcomingAppointments, leaves] = await Promise.all([
    prisma.queueEntry.findMany({
      where: { doctorId: doctor.id, date: { gte: startOfDay(today), lte: endOfDay(today) } },
      include: { appointment: { include: { patient: { include: { user: true } } } } },
      orderBy: { tokenNumber: 'asc' },
    }),
    prisma.appointment.count({ where: { doctorId: doctor.id, status: 'COMPLETED' } }),
    prisma.appointment.count({
      where: { doctorId: doctor.id, appointmentDate: { gt: endOfDay(today) }, status: { not: 'CANCELLED' } },
    }),
    prisma.doctorLeave.findMany({
      where: { doctorId: doctor.id, startDate: { gte: startOfDay(today) } },
      orderBy: { startDate: 'asc' },
    }),
  ]);

  return {
    doctor,
    todaysQueue,
    totalPatientsSeen,
    upcomingAppointments,
    leaves,
  };
};

export const getPatientDashboard = async (userId: string) => {
  const patient = await getPatientByUserId(userId);

  const [upcomingAppointments, pastAppointments, notifications] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: patient.id, status: { in: ['PENDING', 'PAID', 'CHECKED_IN', 'IN_PROGRESS'] } },
      include: { doctor: { include: { user: true, department: true } }, payment: true, queueEntry: true },
      orderBy: { appointmentDate: 'asc' },
    }),
    prisma.appointment.findMany({
      where: { patientId: patient.id, status: { in: ['COMPLETED', 'CANCELLED'] } },
      include: { doctor: { include: { user: true, department: true } } },
      orderBy: { appointmentDate: 'desc' },
      take: 10,
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return { patient, upcomingAppointments, pastAppointments, unreadNotifications: notifications };
};
