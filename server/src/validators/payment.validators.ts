import { z } from "zod";

export const recordPaymentSchema = z.object({
  loanId: z.string().min(1, "loanId is required"),
  utrNumber: z
    .string()
    .trim()
    .min(6, "UTR number is required")
    .max(64)
    .transform((value) => value.toUpperCase()),
  amount: z.coerce.number().positive("Payment amount must be positive"),
  paymentDate: z.coerce.date(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
