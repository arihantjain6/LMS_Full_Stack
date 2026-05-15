import { z } from "zod";

import { EmploymentMode } from "../constants/enums";
import { BRE_LIMITS, LOAN_LIMITS } from "../constants/loan.constants";
import { isValidPan } from "../utils/pan";

export const personalDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  pan: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(isValidPan, "Invalid PAN number"),
  dateOfBirth: z.coerce.date().refine((value) => value < new Date(), "Date of birth is invalid"),
  monthlySalary: z.coerce
    .number()
    .min(BRE_LIMITS.MIN_MONTHLY_SALARY, "Monthly salary must be at least 25000"),
  employmentMode: z.nativeEnum(EmploymentMode),
});

export const loanApplicationSchema = z.object({
  loanAmount: z.coerce
    .number()
    .min(LOAN_LIMITS.MIN_AMOUNT, "Loan amount must be at least 50000")
    .max(LOAN_LIMITS.MAX_AMOUNT, "Loan amount cannot exceed 500000"),
  tenureDays: z.coerce
    .number()
    .int()
    .min(LOAN_LIMITS.MIN_TENURE_DAYS, "Tenure must be at least 30 days")
    .max(LOAN_LIMITS.MAX_TENURE_DAYS, "Tenure cannot exceed 365 days"),
});

export const rejectLoanSchema = z.object({
  rejectionReason: z.string().trim().min(3, "Rejection reason is required").max(500),
});

export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
export type RejectLoanInput = z.infer<typeof rejectLoanSchema>;
