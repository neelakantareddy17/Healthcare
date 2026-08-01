import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as appointmentService from '../services/appointment.service.js';
import * as patientService from '../services/patient.service.js';
import * as doctorService from '../services/doctor.service.js';

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const patient = await patientService.getPatientByUserId(req.user!.userId);
  const appointment = await appointmentService.createAppointment({
    patientId: patient.id,
    doctorId: req.body.doctorId,
    appointmentDate: req.body.appointmentDate,
    timeSlot: req.body.timeSlot,
    reason: req.body.reason,
  });
  return ApiResponse.created(res, 'Appointment created, proceed to payment', appointment);
});

export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const { role, userId } = req.user!;
  const filters: Record<string, unknown> = { ...req.query };

  // Non-admins are scoped to their own data
  if (role === 'PATIENT') {
    const patient = await patientService.getPatientByUserId(userId);
    filters.patientId = patient.id;
  } else if (role === 'DOCTOR') {
    const doctor = await doctorService.getDoctorByUserId(userId);
    filters.doctorId = doctor.id;
  }

  const result = await appointmentService.getAppointments(filters as any);
  return ApiResponse.ok(res, 'Appointments fetched', result);
});

export const getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);

  const { role, userId } = req.user!;
  if (role === 'PATIENT' && appointment.patient.userId !== userId) {
    throw ApiError.forbidden('You cannot view this appointment');
  }
  if (role === 'DOCTOR' && appointment.doctor.userId !== userId) {
    throw ApiError.forbidden('You cannot view this appointment');
  }

  return ApiResponse.ok(res, 'Appointment fetched', appointment);
});

export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { role, userId } = req.user!;
  const appointment = await appointmentService.cancelAppointment(
    req.params.id,
    userId,
    role === 'ADMIN',
  );
  return ApiResponse.ok(res, 'Appointment cancelled', appointment);
});
