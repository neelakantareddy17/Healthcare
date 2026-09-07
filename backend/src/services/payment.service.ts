import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { generateQrCodeDataUrl } from '../utils/qrcode.js';

import { createNotification } from './notification.service.js';
import type { PaymentMethod } from '@prisma/client';

/**
 * Mocked payment flow — no real payment gateway integration.
 * Marks the payment as SUCCESS immediately, moves the appointment to PAID,
 * and issues a queue token (only paid appointments receive tokens).
 * Returns a QR code (base64 data URL) encoding the appointment's check-in code.
 */
export const payForAppointment = async (appointmentId: string, method: PaymentMethod) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { doctor: true, patient: true, payment: true },
  });

  if (!appointment) {
    throw ApiError.notFound('Appointment not found');
  }

  if (appointment.status !== 'PENDING') {
    throw ApiError.badRequest(`Cannot pay for an appointment with status ${appointment.status}`);
  }

  if (appointment.payment && appointment.payment.status === 'SUCCESS') {
    throw ApiError.conflict('This appointment has already been paid for');
  }

  const amount = appointment.doctor.consultationFee;

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.upsert({
      where: { appointmentId },
      update: { status: 'SUCCESS', method, amount },
      create: {
        appointmentId,
        amount,
        method,
        status: 'SUCCESS',
      },
    });

    await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: 'PAID' },
    });

    return payment;
  });

  

  const qrCode = await generateQrCodeDataUrl(appointment.checkInCode);

  await createNotification({
    userId: appointment.patient.userId,
    title: 'Payment successful',
    message: 'Payment received. Your appointment is confirmed. Please check in during your selected check-in window.',
  });
  return {
  payment: result,
  qrCode,
  checkInCode: appointment.checkInCode,
};

 
};

export const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { appointment: { include: { doctor: true, patient: true } } },
  });
  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }
  return payment;
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      appointment: {
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
