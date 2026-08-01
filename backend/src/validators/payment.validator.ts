import { z } from 'zod';

export const payAppointmentSchema = z.object({
  method: z.enum(['CASH', 'CARD', 'UPI', 'WALLET']).default('CARD'),
});
