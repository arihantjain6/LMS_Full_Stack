import type { Request, Response } from "express";

import { paymentService } from "../../config/container";
import { sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getAuthenticatedUser } from "../../utils/request-user";
import { objectIdParamsSchema } from "../../validators/common.validators";
import { recordPaymentSchema } from "../../validators/payment.validators";

export const recordPayment = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const input = recordPaymentSchema.parse(req.body);
  const result = await paymentService.recordPayment(currentUser.userId, input);
  sendSuccess(res, result, "Payment recorded successfully", 201);
});

export const getPaymentsByLoan = asyncHandler(async (req: Request, res: Response) => {
  const { loanId } = objectIdParamsSchema.parse(req.params);
  const result = await paymentService.getPaymentsByLoan(loanId);
  sendSuccess(res, result, "Payments fetched successfully");
});
