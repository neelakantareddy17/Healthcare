import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as departmentService from '../services/department.service.js';

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.createDepartment(req.body);
  return ApiResponse.created(res, 'Department created', department);
});

export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await departmentService.getAllDepartments();
  return ApiResponse.ok(res, 'Departments fetched', departments);
});

export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  return ApiResponse.ok(res, 'Department fetched', department);
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body);
  return ApiResponse.ok(res, 'Department updated', department);
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  await departmentService.deleteDepartment(req.params.id);
  return ApiResponse.ok(res, 'Department deleted');
});
