import { LoanStatus } from "../constants/enums";
import type { LoanDocument } from "../modules/loans/loan.model";
import type { UserDocument } from "../modules/users/user.model";
import type { LoanRepository } from "../repositories/loan.repository";
import type { UserRepository } from "../repositories/user.repository";

export class DashboardService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly loanRepository: LoanRepository,
  ) {}

  public async getSalesLeads(): Promise<UserDocument[]> {
    return this.userRepository.findBorrowersWithoutLoans();
  }

  public async getSanctionApplications(): Promise<LoanDocument[]> {
    return this.loanRepository.findByStatus(LoanStatus.APPLIED);
  }

  public async getApprovedForDisbursement(): Promise<LoanDocument[]> {
    return this.loanRepository.findByStatus(LoanStatus.SANCTIONED);
  }

  public async getDisbursedForCollection(): Promise<LoanDocument[]> {
    return this.loanRepository.findByStatus(LoanStatus.DISBURSED);
  }
}
