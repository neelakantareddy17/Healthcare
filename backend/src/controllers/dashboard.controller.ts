import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getAdminDashboard();
  return ApiResponse.ok(res, 'Admin dashboard fetched', data);
});

export const getDoctorDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.getDoctorDashboard(req.user!.userId);
  return ApiResponse.ok(res, 'Doctor dashboard fetched', data);
});

export const getPatientDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.getPatientDashboard(req.user!.userId);
  return ApiResponse.ok(res, 'Patient dashboard fetched', data);
});
