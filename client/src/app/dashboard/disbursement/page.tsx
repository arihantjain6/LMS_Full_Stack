"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyValue } from "@/components/shared/money-value";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { formatDate } from "@/lib/utils/format";
import { dashboardService } from "@/services/dashboard.service";
import type { Loan } from "@/types/domain";
import { useLoadable } from "@/hooks/use-loadable";

export default function DisbursementDashboardPage() {
  const loadLoans = useCallback(() => dashboardService.getApprovedForDisbursement(), []);
  const { data, loading, error, setData } = useLoadable(loadLoans);
  const [target, setTarget] = useState<Loan | null>(null);
  const [working, setWorking] = useState(false);

  const disburse = async () => {
    if (!target) {
      return;
    }

    setWorking(true);

    try {
      await dashboardService.disburseLoan(target._id);
      setData((loans) => loans?.filter((loan) => loan._id !== target._id) ?? []);
      toast.success("Loan disbursed");
      setTarget(null);
    } catch (disburseError) {
      toast.error(disburseError instanceof Error ? disburseError.message : "Unable to disburse loan");
    } finally {
      setWorking(false);
    }
  };

  const columns: DataTableColumn<Loan>[] = [
    { key: "borrower", header: "Borrower", cell: (loan) => loan.personalDetails.fullName },
    { key: "amount", header: "Amount", cell: (loan) => <MoneyValue value={loan.principalAmount} /> },
    { key: "repayment", header: "Repayment", cell: (loan) => <MoneyValue value={loan.totalRepayment} /> },
    { key: "sanctioned", header: "Sanctioned", cell: (loan) => formatDate(loan.sanctionedAt) },
    { key: "status", header: "Status", cell: (loan) => <StatusBadge status={loan.status} /> },
    {
      key: "actions",
      header: "",
      cell: (loan) => (
        <Button size="sm" onClick={() => setTarget(loan)}>
          <Send className="h-4 w-4" />
          Disburse
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Disbursement" description="Release funds for SANCTIONED loans." />
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
          emptyTitle="No sanctioned loans"
          emptyDescription="Approved loans awaiting disbursement will appear here."
        />
      )}
      <ConfirmDialog
        open={Boolean(target)}
        title="Mark loan as disbursed"
        description="This moves the loan to DISBURSED and enables collection activity."
        confirmLabel="Disburse"
        loading={working}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={disburse}
      />
    </div>
  );
}
