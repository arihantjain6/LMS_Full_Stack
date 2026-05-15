import { apiClient, unwrap } from "@/lib/api/axios";
import type { PaymentValues } from "@/lib/validations/payment";
import type { Payment } from "@/types/domain";

export const paymentService = {
  recordPayment: (loanId: string, payload: PaymentValues) =>
    unwrap<Payment>(apiClient.post("/payments", { loanId, ...payload })),
  getByLoan: (loanId: string) => unwrap<Payment[]>(apiClient.get(`/payments/loan/${loanId}`)),
};
