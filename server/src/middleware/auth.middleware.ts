import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { UserRole } from "../constants/enums";
import { config } from "../config/env";
import { AppError } from "../utils/app-error";

const jwtPayloadSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(UserRole),
});

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new AppError("Authentication required", 401));
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const payload = jwtPayloadSchema.parse(decoded);
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
