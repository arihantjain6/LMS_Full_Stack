import { Router } from "express";

import { UserRole } from "../../constants/enums";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate-request";
import { objectIdParamsSchema } from "../../validators/common.validators";
import { loanApplicationSchema, personalDetailsSchema } from "../../validators/loan.validators";
import {
  applyForLoan,
  getLoanById,
  getMyLoans,
  submitPersonalDetails,
} from "./loan.controller";

export const loanRouter = Router();

loanRouter.use(authenticate);

loanRouter.post(
  "/personal-details",
  authorize(UserRole.BORROWER),
  validateRequest({ body: personalDetailsSchema }),
  submitPersonalDetails,
);
loanRouter.post(
  "/apply",
  authorize(UserRole.BORROWER),
  validateRequest({ body: loanApplicationSchema }),
  applyForLoan,
);
loanRouter.get("/my-loans", authorize(UserRole.BORROWER), getMyLoans);
loanRouter.get("/:loanId", validateRequest({ params: objectIdParamsSchema }), getLoanById);
