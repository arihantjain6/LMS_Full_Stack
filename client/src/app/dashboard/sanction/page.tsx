"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormTextarea } from "@/components/forms/form-textarea";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyValue } from "@/components/shared/money-value";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { formatDate } from "@/lib/utils/format";
import { rejectLoanSchema, type RejectLoanValues } from "@/lib/validations/loan";
import { dashboardService } from "@/services/dashboard.service";
import type { Loan } from "@/types/domain";
import { useLoadable } from "@/hooks/use-loadable";

export default function SanctionDashboardPage() {
  const loadLoans = useCallback(() => dashboardService.getSanctionApplications(), []);
  const { data, loading, error, setData } = useLoadable(loadLoans);
  const [approveTarget, setApproveTarget] = useState<Loan | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Loan | null>(null);
  const [working, setWorking] = useState(false);
  const rejectForm = useForm<RejectLoanValues>({
    resolver: zodResolver(rejectLoanSchema),
    defaultValues: { rejectionReason: "" },
  });

  const approve = async () => {
    if (!approveTarget) {
      return;
    }

    setWorking(true);

    try {
      await dashboardService.approveLoan(approveTarget._id);
      setData((loans) => loans?.filter((loan) => loan._id !== approveTarget._id) ?? []);
      toast.success("Loan sanctioned");
      setApproveTarget(null);
    } catch (approveError) {
      toast.error(approveError instanceof Error ? approveError.message : "Unable to sanction loan");
    } finally {
      setWorking(false);
    }
  };

  const reject = async (values: RejectLoanValues) => {
    if (!rejectTarget) {
      return;
    }

    setWorking(true);

    try {
      await dashboardService.rejectLoan(rejectTarget._id, values);
      setData((loans) => loans?.filter((loan) => loan._id !== rejectTarget._id) ?? []);
      toast.success("Loan rejected");
      setRejectTarget(null);
      rejectForm.reset();
    } catch (rejectError) {
      toast.error(rejectError instanceof Error ? rejectError.message : "Unable to reject loan");
    } finally {
      setWorking(false);
    }
  };

  const columns: DataTableColumn<Loan>[] = [
    { key: "borrower", header: "Borrower", cell: (loan) => loan.personalDetails.fullName },
    { key: "pan", header: "PAN", cell: (loan) => loan.personalDetails.pan },
    { key: "amount", header: "Amount", cell: (loan) => <MoneyValue value={loan.principalAmount} /> },
    { key: "repayment", header: "Repayment", cell: (loan) => <MoneyValue value={loan.totalRepayment} /> },
    { key: "applied", header: "Applied", cell: (loan) => formatDate(loan.createdAt) },
    { key: "status", header: "Status", cell: (loan) => <StatusBadge status={loan.status} /> },
    {
      key: "actions",
      header: "",
      cell: (loan) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => setApproveTarget(loan)}>
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setRejectTarget(loan)}>
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sanction Queue" description="Review APPLIED loans and decide sanction outcome." />
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          emptyTitle="No applications pending"
          emptyDescription="APPLIED loans will appear here."
        />
      )}
      <ConfirmDialog
        open={Boolean(approveTarget)}
        title="Sanction loan"
        description="This moves the loan to SANCTIONED and makes it visible to disbursement."
        confirmLabel="Sanction"
        loading={working}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        onConfirm={approve}
      />
      <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject loan</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={rejectForm.handleSubmit(reject)}>
            <FormTextarea
              label="Rejection reason"
              error={rejectForm.formState.errors.rejectionReason}
              registration={rejectForm.register("rejectionReason")}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRejectTarget(null)} disabled={working}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={working}>
                {working ? "Rejecting..." : "Reject loan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
