export type UserRole =
  | "ADMIN"
  | "BORROWER"
  | "SALES"
  | "SANCTION"
  | "DISBURSEMENT"
  | "COLLECTION";

export type EmploymentMode = "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";

export type LoanStatus =
  | "LEAD"
  | "APPLIED"
  | "SANCTIONED"
  | "REJECTED"
  | "DISBURSED"
  | "CLOSED";

export interface BorrowerProfile {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  brePassed: boolean;
  breCheckedAt: string;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  borrowerProfile?: BorrowerProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoanPersonalDetails {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface Loan {
  _id: string;
  borrower: string;
  personalDetails: LoanPersonalDetails;
  salarySlipDocuments: string[];
  principalAmount: number;
  tenureDays: number;
  interestRatePa: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
  totalPaid: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedAt?: string;
  rejectedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  borrower: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedDocument {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}
