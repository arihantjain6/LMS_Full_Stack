import { z } from "zod";

export const paymentSchema = z.object({
  utrNumber: z
    .string()
    .trim()
    .min(6, "UTR number is required")
    .max(64)
    .transform((value) => value.toUpperCase()),
  amount: z.number().positive("Payment amount must be positive"),
  paymentDate: z.string().min(1, "Payment date is required"),
});

export type PaymentValues = z.infer<typeof paymentSchema>;
