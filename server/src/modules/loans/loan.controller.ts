import type { Request, Response } from "express";

import { loanService } from "../../config/container";
import { sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getAuthenticatedUser } from "../../utils/request-user";
import { objectIdParamsSchema } from "../../validators/common.validators";
import {
  loanApplicationSchema,
  personalDetailsSchema,
} from "../../validators/loan.validators";

export const submitPersonalDetails = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const input = personalDetailsSchema.parse(req.body);
  const result = await loanService.submitPersonalDetails(currentUser.userId, input);
  sendSuccess(res, result, "Borrower details saved successfully");
});

export const applyForLoan = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const input = loanApplicationSchema.parse(req.body);
  const result = await loanService.applyForLoan(currentUser.userId, input);
  sendSuccess(res, result, "Loan application submitted successfully", 201);
});

export const getMyLoans = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const result = await loanService.getMyLoans(currentUser.userId);
  sendSuccess(res, result, "Loans fetched successfully");
});

export const getLoanById = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const { loanId } = objectIdParamsSchema.parse(req.params);
  const result = await loanService.getLoanForUser(currentUser, loanId);
  sendSuccess(res, result, "Loan fetched successfully");
});
