import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

import { config } from "../config/env";
import { logger } from "../config/logger";
import { AppError } from "../utils/app-error";
import { isDuplicateKeyError } from "../utils/mongo";

function hasStatusCode(error: unknown): error is { statusCode: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error &&
    typeof error.statusCode === "number" &&
    typeof error.message === "string"
  );
}

function hasErrorName(error: unknown, name: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === name
  );
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Validation failed";
    res.status(400).json({ success: false, message });
    return;
  }

  if (isDuplicateKeyError(error)) {
    res.status(409).json({ success: false, message: "Duplicate resource" });
    return;
  }

  if (hasErrorName(error, "MulterError")) {
    res.status(400).json({ success: false, message: "Invalid file upload" });
    return;
  }

  if (hasStatusCode(error)) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }

  logger.error({ error }, "Unhandled error");
  res.status(500).json({
    success: false,
    message: config.nodeEnv === "production" ? "Internal server error" : "Unexpected error",
  });
};
