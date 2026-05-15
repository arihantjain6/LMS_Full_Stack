import { AuditLogRepository } from "../repositories/audit-log.repository";
import { DocumentRepository } from "../repositories/document.repository";
import { LoanRepository } from "../repositories/loan.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { BreService } from "../services/bre.service";
import { DashboardService } from "../services/dashboard.service";
import { LoanService } from "../services/loan.service";
import { PaymentService } from "../services/payment.service";
import { UploadService } from "../services/upload.service";

const userRepository = new UserRepository();
const loanRepository = new LoanRepository();
const documentRepository = new DocumentRepository();
const paymentRepository = new PaymentRepository();
const auditLogRepository = new AuditLogRepository();

const breService = new BreService();

export const authService = new AuthService(userRepository);
export const uploadService = new UploadService(documentRepository);
export const dashboardService = new DashboardService(userRepository, loanRepository);
export const loanService = new LoanService(
  userRepository,
  loanRepository,
  documentRepository,
  auditLogRepository,
  breService,
);
export const paymentService = new PaymentService(
  loanRepository,
  paymentRepository,
  auditLogRepository,
);
