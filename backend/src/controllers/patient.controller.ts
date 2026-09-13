import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandler.js';

import { ApiResponse } from '../utils/ApiResponse.js';

import { ApiError } from '../utils/ApiError.js';

import * as patientService from '../services/patient.service.js';

export const getAllPatients = asyncHandler(
  async (_req: Request, res: Response) => {
    const patients =
      await patientService.getAllPatients();

    return ApiResponse.ok(
      res,
      'Patients fetched',
      patients,
    );
  },
);

export const getPatientById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Patient ID is required',
      );
    }

    const patient =
      await patientService.getPatientById(id);

    if (req.user!.role === 'PATIENT' && patient.userId !== req.user!.userId) {
      throw ApiError.forbidden('You can only view your own profile');
    }

    return ApiResponse.ok(
      res,
      'Patient fetched',
      patient,
    );
  },
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Patient ID is required',
      );
    }

    const target =
      await patientService.getPatientById(id);

    const isSelf =
      target.userId === req.user!.userId;

    const isAdmin =
      req.user!.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      throw ApiError.forbidden(
        'You can only update your own profile',
      );
    }

    const patient =
      await patientService.updatePatient(
        id,
        req.body,
      );

    return ApiResponse.ok(
      res,
      'Patient updated',
      patient,
    );
  },
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest(
        'Patient ID is required',
      );
    }

    const result =
      await patientService.deletePatient(id);

    return ApiResponse.ok(
      res,
      result.message,
    );
  },
);