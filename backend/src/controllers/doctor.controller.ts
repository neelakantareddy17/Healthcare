import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as doctorService from '../services/doctor.service.js';
import { ApiError } from '../utils/ApiError.js';

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.createDoctor(req.body);
  return ApiResponse.created(res, 'Doctor account created', doctor);
});

export const getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
  const departmentId = req.query.departmentId as string | undefined;
  const doctors = await doctorService.getAllDoctors(departmentId);
  return ApiResponse.ok(res, 'Doctors fetched', doctors);
});

export const getDoctorById = asyncHandler(async (req: Request, res: Response) => {
 const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Doctor ID is required');
}

const doctor = await doctorService.getDoctorById(id);
  return ApiResponse.ok(res, 'Doctor fetched', doctor);
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Doctor ID is required');
}

const doctor = await doctorService.updateDoctor(
  id,
  req.body,
);
  return ApiResponse.ok(res, 'Doctor updated', doctor);
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Doctor ID is required');
}

const result = await doctorService.deleteDoctor(id);
  return ApiResponse.ok(res, result.message);
});
