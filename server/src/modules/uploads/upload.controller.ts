import type { Request, Response } from "express";

import { uploadService } from "../../config/container";
import { sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getAuthenticatedUser } from "../../utils/request-user";

export const uploadSalarySlip = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const result = await uploadService.storeSalarySlip(currentUser.userId, req.file);
  sendSuccess(res, result, "Salary slip uploaded successfully", 201);
});
