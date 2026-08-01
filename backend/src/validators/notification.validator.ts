import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['APPOINTMENT', 'PAYMENT', 'QUEUE', 'LEAVE', 'GENERAL']).default('GENERAL'),
});
