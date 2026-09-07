import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

import * as appointmentService from '../services/appointment.service.js';
import * as patientService from '../services/patient.service.js';
import * as doctorService from '../services/doctor.service.js';

export const createAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.getPatientByUserId(
      req.user!.userId,
    );

    const appointment = await appointmentService.createAppointment({
      patientId: patient.id,
      doctorId: req.body.doctorId,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot,
      reason: req.body.reason,
    });

    return ApiResponse.created(
      res,
      'Appointment created, proceed to payment',
      appointment,
    );
  },
);

export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const { role, userId } = req.user!;

    const filters: {
      status?: string;
      doctorId?: string;
      patientId?: string;
      date?: string;
      page?: number;
      limit?: number;
    } = {};

    if (typeof req.query.status === 'string') {
      filters.status = req.query.status;
    }

    if (typeof req.query.doctorId === 'string') {
      filters.doctorId = req.query.doctorId;
    }

    if (typeof req.query.patientId === 'string') {
      filters.patientId = req.query.patientId;
    }

    if (typeof req.query.date === 'string') {
      filters.date = req.query.date;
    }

    if (typeof req.query.page === 'string') {
      const page = Number(req.query.page);

      if (!Number.isNaN(page)) {
        filters.page = page;
      }
    }

    if (typeof req.query.limit === 'string') {
      const limit = Number(req.query.limit);

      if (!Number.isNaN(limit)) {
        filters.limit = limit;
      }
    }

    // Patients can only see their own appointments
    if (role === 'PATIENT') {
      const patient =
        await patientService.getPatientByUserId(userId);

      filters.patientId = patient.id;
      delete filters.doctorId;
    }

    // Doctors can only see their own appointments
    else if (role === 'DOCTOR') {
      const doctor =
        await doctorService.getDoctorByUserId(userId);

      filters.doctorId = doctor.id;
      delete filters.patientId;
    }

    const result =
      await appointmentService.getAppointments(filters);

    return ApiResponse.ok(
      res,
      'Appointments fetched',
      result,
    );
  },
);

export const getAppointmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Appointment ID is required',
      );
    }

    const appointment =
      await appointmentService.getAppointmentById(id);

    const { role, userId } = req.user!;

    // Patients can only view their own appointments
    if (
      role === 'PATIENT' &&
      appointment.patient.userId !== userId
    ) {
      throw ApiError.forbidden(
        'You cannot view this appointment',
      );
    }

    // Doctors can only view their own appointments
    if (
      role === 'DOCTOR' &&
      appointment.doctor.userId !== userId
    ) {
      throw ApiError.forbidden(
        'You cannot view this appointment',
      );
    }

    return ApiResponse.ok(
      res,
      'Appointment fetched',
      appointment,
    );
  },
);
export const cancelAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Appointment ID is required',
      );
    }

    const { role, userId } = req.user!;

    const appointment =
      await appointmentService.cancelAppointment(
        id,
        userId,
        role === 'ADMIN',
      );

    return ApiResponse.ok(
      res,
      'Appointment cancelled',
      appointment,
    );
  },
);