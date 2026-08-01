import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as queueService from '../services/queue.service.js';
import * as doctorService from '../services/doctor.service.js';

export const getDoctorQueue = asyncHandler(async (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  const queue = await queueService.getDoctorQueueForToday(req.params.doctorId, date);
  return ApiResponse.ok(res, "Doctor's queue fetched", queue);
});

export const getMyQueue = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.userId);
  const date = req.query.date as string | undefined;
  const queue = await queueService.getDoctorQueueForToday(doctor.id, date);
  return ApiResponse.ok(res, 'Your queue fetched', queue);
});

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await queueService.checkInAppointment(req.body.checkInCode);
  return ApiResponse.ok(res, 'Checked in successfully', appointment);
});

export const updateQueueStatus = asyncHandler(async (req: Request, res: Response) => {
  const entry = await queueService.updateQueueEntryStatus(req.params.id, req.body.status);
  return ApiResponse.ok(res, 'Queue status updated', entry);
});

export const getQueueEntryById = asyncHandler(async (req: Request, res: Response) => {
  const entry = await queueService.getQueueEntryById(req.params.id);
  return ApiResponse.ok(res, 'Queue entry fetched', entry);
});
