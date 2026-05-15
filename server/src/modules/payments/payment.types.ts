import type { Types } from "mongoose";

export interface Payment {
  loan: Types.ObjectId;
  borrower: Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
