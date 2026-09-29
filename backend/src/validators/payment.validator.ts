import { z } from 'zod';

export const payAppointmentSchema = z.object({
  method: z.enum(['CASH', 'CARD', 'UPI', 'WALLET']).default('CARD'),
  cardNumber: z.string().regex(/^\d{12,19}$/, 'Enter a valid card number').optional(),
}).superRefine((value, context) => {
  if (value.method === 'CARD' && !value.cardNumber) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['cardNumber'], message: 'Card number is required' });
  }
});
