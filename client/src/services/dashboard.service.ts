import { apiClient, unwrap } from "@/lib/api/axios";
import type { RejectLoanValues } from "@/lib/validations/loan";
import type { Loan, User } from "@/types/domain";

export const dashboardService = {
  getSalesLeads: () => unwrap<User[]>(apiClient.get("/dashboard/sales/leads")),
  getSanctionApplications: () => unwrap<Loan[]>(apiClient.get("/dashboard/sanction/applications")),
  approveLoan: (loanId: string) =>
    unwrap<Loan>(apiClient.patch(`/dashboard/sanction/${loanId}/approve`)),
  rejectLoan: (loanId: string, payload: RejectLoanValues) =>
    unwrap<Loan>(apiClient.patch(`/dashboard/sanction/${loanId}/reject`, payload)),
  getApprovedForDisbursement: () =>
    unwrap<Loan[]>(apiClient.get("/dashboard/disbursement/approved")),
  disburseLoan: (loanId: string) =>
    unwrap<Loan>(apiClient.patch(`/dashboard/disbursement/${loanId}/disburse`)),
  getCollectionLoans: () => unwrap<Loan[]>(apiClient.get("/dashboard/collection/disbursed")),
};
