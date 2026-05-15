import { Router } from "express";

import { UserRole } from "../../constants/enums";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { salarySlipUpload } from "../../middleware/upload.middleware";
import { uploadSalarySlip } from "./upload.controller";

export const uploadRouter = Router();

uploadRouter.post(
  "/salary-slip",
  authenticate,
  authorize(UserRole.BORROWER),
  salarySlipUpload,
  uploadSalarySlip,
);
