import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as leaveService from '../services/doctorLeave.service.js';
import * as doctorService from '../services/doctor.service.js';

export const createLeave = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.userId);
  const leave = await leaveService.createLeave({
    doctorId: doctor.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
  });
  return ApiResponse.created(res, 'Leave recorded', leave);
});

export const getLeaves = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role === 'DOCTOR') {
    const doctor = await doctorService.getDoctorByUserId(req.user!.userId);
    const leaves = await leaveService.getLeavesForDoctor(doctor.id);
    return ApiResponse.ok(res, 'Leaves fetched', leaves);
  }
  const leaves = await leaveService.getAllLeaves();
  return ApiResponse.ok(res, 'Leaves fetched', leaves);
});

export const getLeaveById = asyncHandler(async (req: Request, res: Response) => {
  const leave = await leaveService.getLeaveById(req.params.id);
  return ApiResponse.ok(res, 'Leave fetched', leave);
});

export const deleteLeave = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  let doctorId = '';
  if (!isAdmin) {
    const doctor = await doctorService.getDoctorByUserId(req.user!.userId);
    doctorId = doctor.id;
  }
  const result = await leaveService.deleteLeave(req.params.id, doctorId, isAdmin);
  return ApiResponse.ok(res, result.message);
});
