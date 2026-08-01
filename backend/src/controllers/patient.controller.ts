import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as patientService from '../services/patient.service.js';

export const getAllPatients = asyncHandler(async (_req: Request, res: Response) => {
  const patients = await patientService.getAllPatients();
  return ApiResponse.ok(res, 'Patients fetched', patients);
});

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const patient = await patientService.getPatientById(req.params.id);
  return ApiResponse.ok(res, 'Patient fetched', patient);
});

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
  const target = await patientService.getPatientById(req.params.id);

  const isSelf = target.userId === req.user!.userId;
  const isAdmin = req.user!.role === 'ADMIN';
  if (!isSelf && !isAdmin) {
    throw ApiError.forbidden('You can only update your own profile');
  }

  const patient = await patientService.updatePatient(req.params.id, req.body);
  return ApiResponse.ok(res, 'Patient updated', patient);
});

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
  const result = await patientService.deletePatient(req.params.id);
  return ApiResponse.ok(res, result.message);
});
