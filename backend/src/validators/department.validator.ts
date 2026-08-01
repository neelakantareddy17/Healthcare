import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid id'),
});
