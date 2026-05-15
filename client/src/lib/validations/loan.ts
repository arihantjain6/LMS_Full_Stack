import { z } from "zod";

import { LOAN_LIMITS } from "@/lib/constants/loans";

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const personalDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  pan: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine((value) => panRegex.test(value), "Invalid PAN number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  monthlySalary: z.number().min(25_000, "Monthly salary must be at least 25000"),
  employmentMode: z.enum(["SALARIED", "SELF_EMPLOYED", "UNEMPLOYED"]),
});

export const loanApplicationSchema = z.object({
  loanAmount: z
    .number()
    .min(LOAN_LIMITS.MIN_AMOUNT, "Loan amount must be at least 50000")
    .max(LOAN_LIMITS.MAX_AMOUNT, "Loan amount cannot exceed 500000"),
  tenureDays: z
    .number()
    .int()
    .min(LOAN_LIMITS.MIN_TENURE_DAYS, "Tenure must be at least 30 days")
    .max(LOAN_LIMITS.MAX_TENURE_DAYS, "Tenure cannot exceed 365 days"),
});

export const rejectLoanSchema = z.object({
  rejectionReason: z.string().trim().min(3, "Rejection reason is required").max(500),
});

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type LoanApplicationValues = z.infer<typeof loanApplicationSchema>;
export type RejectLoanValues = z.infer<typeof rejectLoanSchema>;
