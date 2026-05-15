import type { Request, Response } from "express";

import { dashboardService, loanService } from "../../config/container";
import { LoanStatus } from "../../constants/enums";
import { sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getAuthenticatedUser } from "../../utils/request-user";
import { objectIdParamsSchema } from "../../validators/common.validators";
import { rejectLoanSchema } from "../../validators/loan.validators";

export const getSalesLeads = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getSalesLeads();
  sendSuccess(res, result, "Sales leads fetched successfully");
});

export const getSanctionApplications = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getSanctionApplications();
  sendSuccess(res, result, "Sanction applications fetched successfully");
});

export const approveLoan = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const { loanId } = objectIdParamsSchema.parse(req.params);
  const result = await loanService.approveLoan(currentUser.userId, loanId);
  sendSuccess(res, result, "Loan sanctioned successfully");
});

export const rejectLoan = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const { loanId } = objectIdParamsSchema.parse(req.params);
  const input = rejectLoanSchema.parse(req.body);
  const result = await loanService.rejectLoan(currentUser.userId, loanId, input);
  sendSuccess(res, result, "Loan rejected successfully");
});

export const getApprovedForDisbursement = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getApprovedForDisbursement();
  sendSuccess(res, result, "Approved loans fetched successfully");
});

export const disburseLoan = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);
  const { loanId } = objectIdParamsSchema.parse(req.params);
  const result = await loanService.disburseLoan(currentUser.userId, loanId);
  sendSuccess(res, result, "Loan disbursed successfully");
});

export const getDisbursedForCollection = asyncHandler(async (_req: Request, res: Response) => {
  const result = await loanService.getLoansByStatus(LoanStatus.DISBURSED);
  sendSuccess(res, result, "Disbursed loans fetched successfully");
});
