import { z } from 'zod';

export const createLeaveSchema = z
  .object({
    startDate: z.string().min(1, 'startDate is required (YYYY-MM-DD)'),
    endDate: z.string().min(1, 'endDate is required (YYYY-MM-DD)'),
    reason: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'startDate must be before or equal to endDate',
    path: ['endDate'],
  });
