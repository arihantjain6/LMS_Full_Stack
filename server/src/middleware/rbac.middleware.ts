import type { NextFunction, Request, RequestHandler, Response } from "express";

import { UserRole } from "../constants/enums";
import { AppError } from "../utils/app-error";

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentUser = req.user;

    if (!currentUser) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (currentUser.role === UserRole.ADMIN || allowedRoles.includes(currentUser.role)) {
      next();
      return;
    }

    next(new AppError("Forbidden", 403));
  };
}
