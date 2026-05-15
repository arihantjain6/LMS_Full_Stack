import { EmploymentMode } from "../constants/enums";
import { BRE_LIMITS } from "../constants/loan.constants";
import type { PersonalDetailsInput } from "../validators/loan.validators";
import { calculateAge } from "../utils/date";
import { isValidPan } from "../utils/pan";

export interface BreResult {
  eligible: boolean;
  reasons: string[];
}

export class BreService {
  public evaluate(input: PersonalDetailsInput): BreResult {
    const reasons: string[] = [];
    const age = calculateAge(input.dateOfBirth);

    if (!isValidPan(input.pan)) {
      reasons.push("Invalid PAN number");
    }

    if (age < BRE_LIMITS.MIN_AGE) {
      reasons.push("Borrower must be at least 23 years old");
    }

    if (age > BRE_LIMITS.MAX_AGE) {
      reasons.push("Borrower age cannot exceed 50 years");
    }

    if (input.monthlySalary < BRE_LIMITS.MIN_MONTHLY_SALARY) {
      reasons.push("Monthly salary must be at least 25000");
    }

    if (input.employmentMode === EmploymentMode.UNEMPLOYED) {
      reasons.push("Unemployed borrowers are not eligible");
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  }
}
