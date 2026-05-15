"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyValue } from "@/components/shared/money-value";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils/format";
import { loanService } from "@/services/loan.service";
import type { Loan } from "@/types/domain";
import { useLoadable } from "@/hooks/use-loadable";

export default function BorrowerLoansPage() {
  const loadLoans = useCallback(() => loanService.getMyLoans(), []);
  const { data, loading, error } = useLoadable(loadLoans);

  const columns: DataTableColumn<Loan>[] = [
    { key: "createdAt", header: "Applied", cell: (loan) => formatDate(loan.createdAt) },
    { key: "amount", header: "Amount", cell: (loan) => <MoneyValue value={loan.principalAmount} /> },
    { key: "repayment", header: "Repayment", cell: (loan) => <MoneyValue value={loan.totalRepayment} /> },
    { key: "outstanding", header: "Outstanding", cell: (loan) => <MoneyValue value={loan.outstandingAmount} /> },
    { key: "status", header: "Status", cell: (loan) => <StatusBadge status={loan.status} /> },
    {
      key: "action",
      header: "",
      cell: (loan) => (
        <Button asChild variant="outline" size="sm">
          <Link href={`/borrower/loans/${loan._id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Loans" description="Track your applications, repayment totals, and loan status." />
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
          emptyTitle="No loans yet"
          emptyDescription="Start a loan application to see it here."
        />
      )}
    </div>
  );
}
