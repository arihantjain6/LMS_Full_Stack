import { Types } from "mongoose";

import { AppError } from "./app-error";

export function assertValidObjectId(value: string, label = "id"): void {
  if (!Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
}
