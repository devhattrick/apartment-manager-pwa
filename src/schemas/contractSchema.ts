import dayjs from 'dayjs';
import { z } from 'zod';

export const contractSchema = z
  .object({
    guestId: z.string().min(1, 'validationRequired'),
    roomId: z.string().min(1, 'validationRequired'),
    stayType: z.enum(['DAILY', 'MONTHLY']),
    price: z.number().gt(0, 'validationPriceGreaterThanZero'),
    checkInDate: z.string().min(1, 'validationRequired'),
    checkOutDate: z.string().min(1, 'validationRequired'),
    status: z.enum(['ACTIVE', 'RESERVED']),
  })
  .refine(
    (data) => dayjs(data.checkOutDate).isAfter(dayjs(data.checkInDate)),
    {
      message: 'validationInvalidDateRange',
      path: ['checkOutDate'],
    }
  );

export type ContractFormValues = z.infer<typeof contractSchema>;
