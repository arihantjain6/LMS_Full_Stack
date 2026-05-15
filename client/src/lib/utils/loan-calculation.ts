import { LOAN_LIMITS } from "@/lib/constants/loans";

export function calculateSimpleInterest(principal: number, tenureDays: number): number {
  return Math.round(((principal * LOAN_LIMITS.INTEREST_RATE_PA * tenureDays) / (365 * 100)) * 100) / 100;
}

export function calculateTotalRepayment(principal: number, tenureDays: number): number {
  return principal + calculateSimpleInterest(principal, tenureDays);
}
