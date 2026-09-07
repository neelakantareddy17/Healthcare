import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as paymentService from '../services/payment.service.js';
import * as appointmentService from '../services/appointment.service.js';

export const payForAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointmentId = req.params.appointmentId;

  if (!appointmentId) {
    throw ApiError.badRequest('Appointment ID is required');
  }

  const appointment = await appointmentService.getAppointmentById(appointmentId);

  if (req.user!.role === 'PATIENT' && appointment.patient.userId !== req.user!.userId) {
    throw ApiError.forbidden('You can only pay for your own appointments');
  }

  const result = await paymentService.payForAppointment(
    appointmentId,
    req.body.method,
  );

  return ApiResponse.ok(res, 'Payment successful, appointment confirmed', result);
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw ApiError.badRequest('Payment ID is required');
  }

  const payment = await paymentService.getPaymentById(id);

  return ApiResponse.ok(res, 'Payment fetched', payment);
});

export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments();

  return ApiResponse.ok(res, 'Payments fetched', payments);
});