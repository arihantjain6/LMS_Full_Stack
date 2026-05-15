import { Schema, model, type HydratedDocument } from "mongoose";

import { EmploymentMode, UserRole } from "../../constants/enums";
import type { User } from "./user.types";

export type UserDocument = HydratedDocument<User>;

const borrowerProfileSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: {
      type: String,
      enum: Object.values(EmploymentMode),
      required: true,
    },
    brePassed: { type: Boolean, required: true, default: false },
    breCheckedAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    borrowerProfile: borrowerProfileSchema,
  },
  { timestamps: true },
);

export const UserModel = model<User>("User", userSchema);
