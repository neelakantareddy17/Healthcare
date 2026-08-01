import { z } from 'zod';

export const checkInSchema = z.object({
  checkInCode: z.string().uuid('Invalid check-in code'),
});

export const updateQueueStatusSchema = z.object({
  status: z.enum(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']),
});
