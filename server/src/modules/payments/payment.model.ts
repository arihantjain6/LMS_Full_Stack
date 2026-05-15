import { Schema, model, type HydratedDocument } from "mongoose";

import type { Payment } from "./payment.types";

export type PaymentDocument = HydratedDocument<Payment>;

const paymentSchema = new Schema<Payment>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true, index: true },
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    utrNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, required: true },
  },
  { timestamps: true },
);

export const PaymentModel = model<Payment>("Payment", paymentSchema);
