import type { EmploymentMode, LoanStatus } from "../../constants/enums";
import type { Types } from "mongoose";

export interface LoanPersonalDetails {
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface LoanAmounts {
  principalAmount: number;
  tenureDays: number;
  interestRatePa: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
  totalPaid: number;
}

export interface Loan {
  borrower: Types.ObjectId;
  personalDetails: LoanPersonalDetails;
  salarySlipDocuments: Types.ObjectId[];
  principalAmount: number;
  tenureDays: number;
  interestRatePa: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
  totalPaid: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedAt?: Date;
  rejectedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
