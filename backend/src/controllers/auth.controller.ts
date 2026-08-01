import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerPatient(req.body);
  return ApiResponse.created(res, 'Patient registered successfully', result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return ApiResponse.ok(res, 'Login successful', result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  return ApiResponse.ok(res, 'Current user fetched', user);
});
