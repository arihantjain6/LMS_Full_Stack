import type { Request, Response } from "express";

import { authService } from "../../config/container";
import { sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getAuthenticatedUser } from "../../utils/request-user";
import { loginSchema, registerSchema } from "../../validators/auth.validators";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  sendSuccess(res, result, "Registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  sendSuccess(res, result, "Logged in successfully");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const result = await authService.getCurrentUser(currentUser.userId);
  sendSuccess(res, result, "Current user fetched successfully");
});
