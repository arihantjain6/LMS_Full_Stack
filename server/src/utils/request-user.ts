import type { Request } from "express";

import type { AuthenticatedUser } from "../types/auth.types";
import { AppError } from "./app-error";

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  return req.user;
}
