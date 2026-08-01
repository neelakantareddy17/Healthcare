import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  departmentId: z.string().uuid(),
  specialization: z.string().min(2),
  experienceYears: z.number().int().nonnegative().optional(),
  consultationFee: z.number().positive(),
  qualification: z.string().optional(),
});

export const updateDoctorSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  specialization: z.string().min(2).optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  consultationFee: z.number().positive().optional(),
  qualification: z.string().optional(),
});
