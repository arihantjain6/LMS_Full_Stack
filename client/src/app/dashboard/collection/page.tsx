"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FormInput } from "@/components/forms/form-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyValue } from "@/components/shared/money-value";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { formatPercent } from "@/lib/utils/format";
import { paymentSchema, type PaymentValues } from "@/lib/validations/payment";
import { dashboardService } from "@/services/dashboard.service";
import { paymentService } from "@/services/payment.service";
import type { Loan } from "@/types/domain";
import { useLoadable } from "@/hooks/use-loadable";

export default function CollectionDashboardPage() {
  const loadLoans = useCallback(() => dashboardService.getCollectionLoans(), []);
  const { data, loading, error, reload } = useLoadable(loadLoans);
  const [target, setTarget] = useState<Loan | null>(null);
  const [working, setWorking] = useState(false);
  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      utrNumber: "",
      amount: 0,
      paymentDate: new Date().toISOString().slice(0, 10),
    },
  });

  const submitPayment = async (values: PaymentValues) => {
    if (!target) {
      return;
    }

    if (values.amount > target.outstandingAmount) {
      toast.error("Payment amount cannot exceed outstanding balance");
      return;
    }

    setWorking(true);

    try {
      await paymentService.recordPayment(target._id, values);
      toast.success("Payment recorded");
      setTarget(null);
      form.reset();
      await reload();
    } catch (paymentError) {
      toast.error(paymentError instanceof Error ? paymentError.message : "Unable to record payment");
    } finally {
      setWorking(false);
    }
  };

  const columns: DataTableColumn<Loan>[] = [
    { key: "borrower", header: "Borrower", cell: (loan) => loan.personalDetails.fullName },
    { key: "repayment", header: "Repayment", cell: (loan) => <MoneyValue value={loan.totalRepayment} /> },
    { key: "paid", header: "Paid", cell: (loan) => <MoneyValue value={loan.totalPaid} /> },
    { key: "outstanding", header: "Outstanding", cell: (loan) => <MoneyValue value={loan.outstandingAmount} /> },
    {
      key: "progress",
      header: "Progress",
      cell: (loan) => {
        const progress = loan.totalRepayment > 0 ? (loan.totalPaid / loan.totalRepayment) * 100 : 0;
        return (
          <div className="min-w-32 space-y-1">
            <Progress value={progress} />
            <span className="text-xs text-muted-foreground">{formatPercent(progress)}</span>
          </div>
        );
      },
    },
    { key: "status", header: "Status", cell: (loan) => <StatusBadge status={loan.status} /> },
    {
      key: "action",
      header: "",
      cell: (loan) => (
        <Button size="sm" onClick={() => setTarget(loan)}>
          <Plus className="h-4 w-4" />
          Payment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Collection" description="Record repayments and track outstanding balances." />
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
          emptyTitle="No disbursed loans"
          emptyDescription="Loans ready for repayment collection will appear here."
        />
      )}
      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
          </DialogHeader>
          {target ? (
            <div className="rounded-md bg-muted p-3 text-sm">
              Outstanding: <MoneyValue value={target.outstandingAmount} className="font-semibold" />
            </div>
          ) : null}
          <form className="space-y-4" onSubmit={form.handleSubmit(submitPayment)}>
            <FormInput label="UTR number" error={form.formState.errors.utrNumber} registration={form.register("utrNumber")} />
            <FormInput
              label="Amount"
              type="number"
              error={form.formState.errors.amount}
              registration={form.register("amount", { valueAsNumber: true })}
            />
            <FormInput
              label="Payment date"
              type="date"
              error={form.formState.errors.paymentDate}
              registration={form.register("paymentDate")}
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={working} onClick={() => setTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={working}>
                {working ? "Recording..." : "Record payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
