import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as paymentService from '../services/payment.service.js';
import * as appointmentService from '../services/appointment.service.js';

export const payForAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);

  if (req.user!.role === 'PATIENT' && appointment.patient.userId !== req.user!.userId) {
    throw ApiError.forbidden('You can only pay for your own appointments');
  }

  const result = await paymentService.payForAppointment(req.params.appointmentId, req.body.method);
  return ApiResponse.ok(res, 'Payment successful, token generated', result);
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  return ApiResponse.ok(res, 'Payment fetched', payment);
});

export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments();
  return ApiResponse.ok(res, 'Payments fetched', payments);
});
