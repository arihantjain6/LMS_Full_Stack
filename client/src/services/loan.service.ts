import { apiClient, unwrap } from "@/lib/api/axios";
import type { LoanApplicationValues, PersonalDetailsValues } from "@/lib/validations/loan";
import type { BorrowerProfile, Loan } from "@/types/domain";

export const loanService = {
  submitPersonalDetails: (payload: PersonalDetailsValues) =>
    unwrap<BorrowerProfile>(apiClient.post("/loans/personal-details", payload)),
  apply: (payload: LoanApplicationValues) => unwrap<Loan>(apiClient.post("/loans/apply", payload)),
  getMyLoans: () => unwrap<Loan[]>(apiClient.get("/loans/my-loans")),
  getById: (loanId: string) => unwrap<Loan>(apiClient.get(`/loans/${loanId}`)),
};
