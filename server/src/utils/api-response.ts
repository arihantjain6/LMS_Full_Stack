import type { Response } from "express";
import type { ApiSuccessResponse } from "../types/api.types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
