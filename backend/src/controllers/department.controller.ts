import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as departmentService from '../services/department.service.js';
import { ApiError } from '../utils/ApiError.js';

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.createDepartment(req.body);
  return ApiResponse.created(res, 'Department created', department);
});

export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await departmentService.getAllDepartments();
  return ApiResponse.ok(res, 'Departments fetched', departments);
});

export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
 const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Department ID is required');
}

const department = await departmentService.getDepartmentById(id);
  return ApiResponse.ok(res, 'Department fetched', department);
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
 const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Department ID is required');
}

const department = await departmentService.updateDepartment(
  id,
  req.body,
);
  return ApiResponse.ok(res, 'Department updated', department);
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
 const { id } = req.params;

if (!id) {
  throw ApiError.badRequest('Department ID is required');
}

await departmentService.deleteDepartment(id);
  return ApiResponse.ok(res, 'Department deleted');
});
