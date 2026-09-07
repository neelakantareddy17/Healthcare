import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandler.js';

import { ApiResponse } from '../utils/ApiResponse.js';

import * as queueService from '../services/queue.service.js';

import * as doctorService from '../services/doctor.service.js';

import { ApiError } from '../utils/ApiError.js';

export const getDoctorQueue = asyncHandler(
  async (req: Request, res: Response) => {
    const { doctorId } = req.params;

    if (!doctorId) {
      throw ApiError.badRequest('Doctor ID is required');
    }

    const date =
      typeof req.query.date === 'string'
        ? req.query.date
        : undefined;

    const queue =
      await queueService.getDoctorQueueForToday(
        doctorId,
        date,
      );

    return ApiResponse.ok(
      res,
      "Doctor's queue fetched",
      queue,
    );
  },
);

export const getMyQueue = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor =
      await doctorService.getDoctorByUserId(
        req.user!.userId,
      );

    const date =
      typeof req.query.date === 'string'
        ? req.query.date
        : undefined;

    const queue =
      await queueService.getDoctorQueueForToday(
        doctor.id,
        date,
      );

    return ApiResponse.ok(
      res,
      'Your queue fetched',
      queue,
    );
  },
);

export const checkIn = asyncHandler(
  async (req: Request, res: Response) => {
    const appointment =
      await queueService.checkInAppointment(
        req.body.checkInCode,
      );

    return ApiResponse.ok(
      res,
      'Checked in successfully',
      appointment,
    );
  },
);

export const updateQueueStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Queue entry ID is required',
      );
    }

    const { userId, role } = req.user!;

    const entry =
      await queueService.updateQueueEntryStatus(
        id,
        req.body.status,
        userId,
        role,
      );

    return ApiResponse.ok(
      res,
      'Queue status updated',
      entry,
    );
  },
);

export const getQueueEntryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Queue entry ID is required',
      );
    }

    const { userId, role } = req.user!;

    const entry =
      await queueService.getQueueEntryById(
        id,
        userId,
        role,
      );

    return ApiResponse.ok(
      res,
      'Queue entry fetched',
      entry,
    );
  },
);