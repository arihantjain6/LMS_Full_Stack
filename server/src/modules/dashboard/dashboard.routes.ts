import { Router } from "express";

import { UserRole } from "../../constants/enums";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate-request";
import { objectIdParamsSchema } from "../../validators/common.validators";
import { rejectLoanSchema } from "../../validators/loan.validators";
import {
  approveLoan,
  disburseLoan,
  getApprovedForDisbursement,
  getDisbursedForCollection,
  getSalesLeads,
  getSanctionApplications,
  rejectLoan,
} from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/sales/leads", authorize(UserRole.SALES), getSalesLeads);

dashboardRouter.get(
  "/sanction/applications",
  authorize(UserRole.SANCTION),
  getSanctionApplications,
);
dashboardRouter.patch(
  "/sanction/:loanId/approve",
  authorize(UserRole.SANCTION),
  validateRequest({ params: objectIdParamsSchema }),
  approveLoan,
);
dashboardRouter.patch(
  "/sanction/:loanId/reject",
  authorize(UserRole.SANCTION),
  validateRequest({ params: objectIdParamsSchema, body: rejectLoanSchema }),
  rejectLoan,
);

dashboardRouter.get(
  "/disbursement/approved",
  authorize(UserRole.DISBURSEMENT),
  getApprovedForDisbursement,
);
dashboardRouter.patch(
  "/disbursement/:loanId/disburse",
  authorize(UserRole.DISBURSEMENT),
  validateRequest({ params: objectIdParamsSchema }),
  disburseLoan,
);

dashboardRouter.get(
  "/collection/disbursed",
  authorize(UserRole.COLLECTION),
  getDisbursedForCollection,
);
