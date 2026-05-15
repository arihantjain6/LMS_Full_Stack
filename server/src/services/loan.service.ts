import { Types } from "mongoose";

import { AuditAction, LoanStatus, UserRole } from "../constants/enums";
import { LOAN_LIMITS } from "../constants/loan.constants";
import type { AuditLogRepository } from "../repositories/audit-log.repository";
import type { DocumentRepository } from "../repositories/document.repository";
import type { LoanRepository } from "../repositories/loan.repository";
import type { UserRepository } from "../repositories/user.repository";
import type { AuthenticatedUser } from "../types/auth.types";
import { AppError } from "../utils/app-error";
import { assertValidObjectId } from "../utils/object-id";
import { roundMoney } from "../utils/money";
import type {
  LoanApplicationInput,
  PersonalDetailsInput,
  RejectLoanInput,
} from "../validators/loan.validators";
import type { LoanDocument } from "../modules/loans/loan.model";
import type { BreService } from "./bre.service";

export class LoanService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly loanRepository: LoanRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly breService: BreService,
  ) {}

  public async submitPersonalDetails(
    userId: string,
    input: PersonalDetailsInput,
  ): Promise<PersonalDetailsInput & { brePassed: boolean; breCheckedAt: Date }> {
    assertValidObjectId(userId, "userId");
    const user = await this.userRepository.findById(userId);

    if (!user || user.role !== UserRole.BORROWER) {
      throw new AppError("Borrower account required", 403);
    }

    this.assertBrePassed(input);
    const borrowerProfile = {
      ...input,
      brePassed: true,
      breCheckedAt: new Date(),
    };

    const updatedUser = await this.userRepository.updateBorrowerProfile(userId, borrowerProfile);

    if (!updatedUser?.borrowerProfile) {
      throw new AppError("Unable to save borrower details", 500);
    }

    return updatedUser.borrowerProfile;
  }

  public async applyForLoan(
    borrowerId: string,
    input: LoanApplicationInput,
  ): Promise<LoanDocument> {
    assertValidObjectId(borrowerId, "borrowerId");
    const user = await this.userRepository.findById(borrowerId);

    if (!user || user.role !== UserRole.BORROWER) {
      throw new AppError("Borrower account required", 403);
    }

    if (!user.borrowerProfile) {
      throw new AppError("Personal details must be submitted before applying", 400);
    }

    this.assertBrePassed(user.borrowerProfile);
    const salarySlips = await this.documentRepository.findSalarySlipsByOwner(borrowerId);

    if (salarySlips.length === 0) {
      throw new AppError("At least one salary slip is required before applying", 400);
    }

    const amounts = this.calculateLoanAmounts(input.loanAmount, input.tenureDays);
    const loan = await this.loanRepository.create({
      borrower: new Types.ObjectId(borrowerId),
      personalDetails: {
        fullName: user.borrowerProfile.fullName,
        pan: user.borrowerProfile.pan,
        dateOfBirth: user.borrowerProfile.dateOfBirth,
        monthlySalary: user.borrowerProfile.monthlySalary,
        employmentMode: user.borrowerProfile.employmentMode,
      },
      salarySlipDocuments: salarySlips.map((document) => new Types.ObjectId(String(document._id))),
      ...amounts,
      status: LoanStatus.APPLIED,
    });

    await this.auditLogRepository.create({
      actor: new Types.ObjectId(borrowerId),
      action: AuditAction.LOAN_APPLIED,
      entityType: "Loan",
      entityId: new Types.ObjectId(String(loan._id)),
      metadata: { loanAmount: input.loanAmount, tenureDays: input.tenureDays },
    });

    return loan;
  }

  public async getMyLoans(borrowerId: string): Promise<LoanDocument[]> {
    assertValidObjectId(borrowerId, "borrowerId");
    return this.loanRepository.findByBorrower(borrowerId);
  }

  public async getLoanForUser(currentUser: AuthenticatedUser, loanId: string): Promise<LoanDocument> {
    assertValidObjectId(loanId, "loanId");
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (currentUser.role === UserRole.BORROWER && String(loan.borrower) !== currentUser.userId) {
      throw new AppError("Forbidden", 403);
    }

    return loan;
  }

  public async getLoansByStatus(status: LoanStatus): Promise<LoanDocument[]> {
    return this.loanRepository.findByStatus(status);
  }

  public async approveLoan(actorId: string, loanId: string): Promise<LoanDocument> {
    const loan = await this.getLoanForTransition(loanId, LoanStatus.APPLIED);
    loan.status = LoanStatus.SANCTIONED;
    loan.sanctionedAt = new Date();
    const savedLoan = await loan.save();

    await this.auditLogRepository.create({
      actor: new Types.ObjectId(actorId),
      action: AuditAction.LOAN_SANCTIONED,
      entityType: "Loan",
      entityId: new Types.ObjectId(String(savedLoan._id)),
    });

    return savedLoan;
  }

  public async rejectLoan(
    actorId: string,
    loanId: string,
    input: RejectLoanInput,
  ): Promise<LoanDocument> {
    const loan = await this.getLoanForTransition(loanId, LoanStatus.APPLIED);
    loan.status = LoanStatus.REJECTED;
    loan.rejectionReason = input.rejectionReason;
    loan.rejectedAt = new Date();
    const savedLoan = await loan.save();

    await this.auditLogRepository.create({
      actor: new Types.ObjectId(actorId),
      action: AuditAction.LOAN_REJECTED,
      entityType: "Loan",
      entityId: new Types.ObjectId(String(savedLoan._id)),
      metadata: { rejectionReason: input.rejectionReason },
    });

    return savedLoan;
  }

  public async disburseLoan(actorId: string, loanId: string): Promise<LoanDocument> {
    const loan = await this.getLoanForTransition(loanId, LoanStatus.SANCTIONED);
    loan.status = LoanStatus.DISBURSED;
    loan.disbursedAt = new Date();
    const savedLoan = await loan.save();

    await this.auditLogRepository.create({
      actor: new Types.ObjectId(actorId),
      action: AuditAction.LOAN_DISBURSED,
      entityType: "Loan",
      entityId: new Types.ObjectId(String(savedLoan._id)),
    });

    return savedLoan;
  }

  private calculateLoanAmounts(principalAmount: number, tenureDays: number) {
    const interestAmount = roundMoney(
      (principalAmount * LOAN_LIMITS.INTEREST_RATE_PA * tenureDays) / (365 * 100),
    );
    const totalRepayment = roundMoney(principalAmount + interestAmount);

    return {
      principalAmount,
      tenureDays,
      interestRatePa: LOAN_LIMITS.INTEREST_RATE_PA,
      interestAmount,
      totalRepayment,
      outstandingAmount: totalRepayment,
      totalPaid: 0,
    };
  }

  private assertBrePassed(input: PersonalDetailsInput): void {
    const result = this.breService.evaluate(input);

    if (!result.eligible) {
      throw new AppError(result.reasons[0] ?? "Borrower is not eligible", 422);
    }
  }

  private async getLoanForTransition(
    loanId: string,
    expectedStatus: LoanStatus,
  ): Promise<LoanDocument> {
    assertValidObjectId(loanId, "loanId");
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.status !== expectedStatus) {
      throw new AppError(`Only ${expectedStatus} loans can be processed for this action`, 409);
    }

    return loan;
  }
}
