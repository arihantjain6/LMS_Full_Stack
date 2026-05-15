import { Router } from "express";

import { UserRole } from "../../constants/enums";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate-request";
import { objectIdParamsSchema } from "../../validators/common.validators";
import { recordPaymentSchema } from "../../validators/payment.validators";
import { getPaymentsByLoan, recordPayment } from "./payment.controller";

export const paymentRouter = Router();

paymentRouter.use(authenticate, authorize(UserRole.COLLECTION));

paymentRouter.post("/", validateRequest({ body: recordPaymentSchema }), recordPayment);
paymentRouter.get(
  "/loan/:loanId",
  validateRequest({ params: objectIdParamsSchema }),
  getPaymentsByLoan,
);
