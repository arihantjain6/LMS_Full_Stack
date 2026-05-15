import { Types, type ClientSession } from "mongoose";

import { PaymentModel, type PaymentDocument } from "../modules/payments/payment.model";
import type { Payment } from "../modules/payments/payment.types";

export class PaymentRepository {
  public async create(
    data: Omit<Payment, "createdAt" | "updatedAt">,
    session?: ClientSession,
  ): Promise<PaymentDocument> {
    const [payment] = await PaymentModel.create([data], { session });

    if (!payment) {
      throw new Error("Failed to create payment");
    }

    return payment;
  }

  public async findByUtr(
    utrNumber: string,
    session?: ClientSession,
  ): Promise<PaymentDocument | null> {
    const query = PaymentModel.findOne({ utrNumber: utrNumber.trim().toUpperCase() });

    if (session) {
      query.session(session);
    }

    return query.exec();
  }

  public async findByLoan(loanId: string): Promise<PaymentDocument[]> {
    return PaymentModel.find({ loan: new Types.ObjectId(loanId) })
      .sort({ paymentDate: -1, createdAt: -1 })
      .exec();
  }
}
