import { Schema, model, type HydratedDocument } from "mongoose";

import { EmploymentMode, LoanStatus } from "../../constants/enums";
import type { Loan } from "./loan.types";

export type LoanDocument = HydratedDocument<Loan>;

const loanPersonalDetailsSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: {
      type: String,
      enum: Object.values(EmploymentMode),
      required: true,
    },
  },
  { _id: false },
);

const loanSchema = new Schema<Loan>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    personalDetails: { type: loanPersonalDetailsSchema, required: true },
    salarySlipDocuments: [{ type: Schema.Types.ObjectId, ref: "Document", required: true }],
    principalAmount: { type: Number, required: true, min: 0 },
    tenureDays: { type: Number, required: true, min: 1 },
    interestRatePa: { type: Number, required: true, min: 0 },
    interestAmount: { type: Number, required: true, min: 0 },
    totalRepayment: { type: Number, required: true, min: 0 },
    outstandingAmount: { type: Number, required: true, min: 0 },
    totalPaid: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      required: true,
      index: true,
    },
    rejectionReason: { type: String, trim: true },
    sanctionedAt: Date,
    rejectedAt: Date,
    disbursedAt: Date,
    closedAt: Date,
  },
  { timestamps: true },
);

loanSchema.index({ status: 1, createdAt: -1 });
loanSchema.index({ borrower: 1, createdAt: -1 });

export const LoanModel = model<Loan>("Loan", loanSchema);
