import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  appointmentDate: z.string().min(1, 'appointmentDate is required (YYYY-MM-DD)'),
  timeSlot: z.string().min(1, 'timeSlot is required, e.g. 10:00-10:15'),
  reason: z.string().optional(),
});

export const appointmentQuerySchema = z.object({
  status: z
    .enum(['PENDING', 'PAID', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional(),
  doctorId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  date: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
