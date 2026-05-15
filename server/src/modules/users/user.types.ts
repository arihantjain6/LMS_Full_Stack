import type { EmploymentMode, UserRole } from "../../constants/enums";

export interface BorrowerProfile {
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  brePassed: boolean;
  breCheckedAt: Date;
}

export interface User {
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  borrowerProfile?: BorrowerProfile;
  createdAt: Date;
  updatedAt: Date;
}
