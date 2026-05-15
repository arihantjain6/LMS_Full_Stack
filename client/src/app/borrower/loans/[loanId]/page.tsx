"use client";

import type React from "react";
import { useCallback } from "react";
import { useParams } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MetricCard } from "@/components/shared/metric-card";
import { MoneyValue } from "@/components/shared/money-value";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatPercent } from "@/lib/utils/format";
import { loanService } from "@/services/loan.service";
import { useLoadable } from "@/hooks/use-loadable";

export default function BorrowerLoanDetailPage() {
  const params = useParams<{ loanId: string }>();
  const loanId = params.loanId;
  const loadLoan = useCallback(() => loanService.getById(loanId), [loanId]);
  const { data: loan, loading, error } = useLoadable(loadLoan);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !loan) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error ?? "Loan not found"}</AlertDescription>
      </Alert>
    );
  }

  const paidPercent = loan.totalRepayment > 0 ? (loan.totalPaid / loan.totalRepayment) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loan Details"
        description={`Applied on ${formatDate(loan.createdAt)}`}
        actions={<StatusBadge status={loan.status} />}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Principal" value={<MoneyValue value={loan.principalAmount} />} />
        <MetricCard label="Interest" value={<MoneyValue value={loan.interestAmount} />} />
        <MetricCard label="Total repayment" value={<MoneyValue value={loan.totalRepayment} />} />
        <MetricCard label="Outstanding" value={<MoneyValue value={loan.outstandingAmount} />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Repayment Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={paidPercent} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Paid <MoneyValue value={loan.totalPaid} />
            </span>
            <span>{formatPercent(paidPercent)}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Borrower Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-2">
          <Info label="Name" value={loan.personalDetails.fullName} />
          <Info label="PAN" value={loan.personalDetails.pan} />
          <Info label="Employment" value={loan.personalDetails.employmentMode.replace("_", " ")} />
          <Info label="Monthly salary" value={<MoneyValue value={loan.personalDetails.monthlySalary} />} />
          <Info label="Tenure" value={`${loan.tenureDays} days`} />
          <Info label="Interest rate" value={`${loan.interestRatePa}% p.a.`} />
          {loan.rejectionReason ? <Info label="Rejection reason" value={loan.rejectionReason} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
