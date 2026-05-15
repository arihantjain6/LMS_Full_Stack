import mongoose, { Types } from "mongoose";

import { AuditAction, LoanStatus } from "../constants/enums";
import type { AuditLogRepository } from "../repositories/audit-log.repository";
import type { LoanRepository } from "../repositories/loan.repository";
import type { PaymentRepository } from "../repositories/payment.repository";
import type { PaymentDocument } from "../modules/payments/payment.model";
import { AppError } from "../utils/app-error";
import { isDuplicateKeyError } from "../utils/mongo";
import { assertValidObjectId } from "../utils/object-id";
import { roundMoney } from "../utils/money";
import type { RecordPaymentInput } from "../validators/payment.validators";

export class PaymentService {
  public constructor(
    private readonly loanRepository: LoanRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  public async recordPayment(
    actorId: string,
    input: RecordPaymentInput,
  ): Promise<PaymentDocument> {
    assertValidObjectId(input.loanId, "loanId");
    const session = await mongoose.startSession();
    let createdPayment: PaymentDocument | null = null;

    try {
      await session.withTransaction(async () => {
        const loan = await this.loanRepository.findById(input.loanId, session);

        if (!loan) {
          throw new AppError("Loan not found", 404);
        }

        if (loan.status !== LoanStatus.DISBURSED) {
          throw new AppError("Payments are allowed only for disbursed loans", 409);
        }

        if (input.amount > loan.outstandingAmount) {
          throw new AppError("Payment amount cannot exceed outstanding amount", 400);
        }

        const duplicateUtr = await this.paymentRepository.findByUtr(input.utrNumber, session);

        if (duplicateUtr) {
          throw new AppError("UTR number already exists", 409);
        }

        createdPayment = await this.paymentRepository.create(
          {
            loan: new Types.ObjectId(input.loanId),
            borrower: loan.borrower,
            utrNumber: input.utrNumber,
            amount: input.amount,
            paymentDate: input.paymentDate,
          },
          session,
        );

        loan.totalPaid = roundMoney(loan.totalPaid + input.amount);
        loan.outstandingAmount = roundMoney(loan.totalRepayment - loan.totalPaid);

        if (loan.outstandingAmount === 0) {
          loan.status = LoanStatus.CLOSED;
          loan.closedAt = new Date();
        }

        await loan.save({ session });
        await this.auditLogRepository.create(
          {
            actor: new Types.ObjectId(actorId),
            action: AuditAction.PAYMENT_RECORDED,
            entityType: "Payment",
            entityId: new Types.ObjectId(String(createdPayment._id)),
            metadata: {
              loanId: input.loanId,
              amount: input.amount,
              utrNumber: input.utrNumber,
            },
          },
          session,
        );

        if (loan.status === LoanStatus.CLOSED) {
          await this.auditLogRepository.create(
            {
              actor: new Types.ObjectId(actorId),
              action: AuditAction.LOAN_CLOSED,
              entityType: "Loan",
              entityId: new Types.ObjectId(input.loanId),
            },
            session,
          );
        }
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError("UTR number already exists", 409);
      }

      throw error;
    } finally {
      await session.endSession();
    }

    if (!createdPayment) {
      throw new AppError("Unable to record payment", 500);
    }

    return createdPayment;
  }

  public async getPaymentsByLoan(loanId: string): Promise<PaymentDocument[]> {
    assertValidObjectId(loanId, "loanId");
    return this.paymentRepository.findByLoan(loanId);
  }
}
