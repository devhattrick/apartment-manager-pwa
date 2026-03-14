import { z } from 'zod';

export const guestSchema = z.object({
  firstName: z.string().trim().min(1, 'validationRequired'),
  lastName: z.string().trim().min(1, 'validationRequired'),
  phone: z.string().trim().optional(),
});

export type GuestFormValues = z.infer<typeof guestSchema>;