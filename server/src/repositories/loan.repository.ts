import { Types, type ClientSession } from "mongoose";

import { LoanStatus } from "../constants/enums";
import { LoanModel, type LoanDocument } from "../modules/loans/loan.model";
import type { Loan } from "../modules/loans/loan.types";

export class LoanRepository {
  public async create(data: Omit<Loan, "createdAt" | "updatedAt">): Promise<LoanDocument> {
    return LoanModel.create(data);
  }

  public async findById(
    loanId: string,
    session?: ClientSession,
  ): Promise<LoanDocument | null> {
    const query = LoanModel.findById(loanId);

    if (session) {
      query.session(session);
    }

    return query.exec();
  }

  public async findByBorrower(borrowerId: string): Promise<LoanDocument[]> {
    return LoanModel.find({ borrower: new Types.ObjectId(borrowerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  public async findByStatus(status: LoanStatus): Promise<LoanDocument[]> {
    return LoanModel.find({ status }).sort({ createdAt: -1 }).exec();
  }
}
