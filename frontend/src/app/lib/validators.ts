import { z } from 'zod';

export const NpvRequestSchema = z
  .object({
    cashFlows: z
      .string()
      .min(1, { message: 'At least one cash flow is required.' }),
    lowerBoundDiscountRate: z.coerce.number().min(0).max(1),
    upperBoundDiscountRate: z.coerce.number().min(0).max(1),
    discountRateIncrement: z.coerce
      .number()
      .min(0.0001, 'Increment must be positive.')
      .max(1),
  })
  .refine(
    (data) => data.lowerBoundDiscountRate <= data.upperBoundDiscountRate,
    {
      message: 'Lower bound rate cannot be greater than the upper bound.',
      path: ['lowerBoundDiscountRate'], // Points the error to this field
    }
  );

export type NpvRequest = z.infer<typeof NpvRequestSchema>;
