import { z } from 'zod';

export const updatePatientSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  avatarId: z.enum(['sage', 'ocean', 'coral', 'lavender', 'sunrise']).optional(),
});
