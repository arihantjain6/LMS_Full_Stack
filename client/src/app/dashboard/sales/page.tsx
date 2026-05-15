"use client";

import { useCallback, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { dashboardService } from "@/services/dashboard.service";
import type { User } from "@/types/domain";
import { useLoadable } from "@/hooks/use-loadable";

export default function SalesDashboardPage() {
  const [search, setSearch] = useState("");
  const loadLeads = useCallback(() => dashboardService.getSalesLeads(), []);
  const { data, loading, error } = useLoadable(loadLeads);

  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase().trim();
    const leads = data ?? [];

    if (!term) {
      return leads;
    }

    return leads.filter((lead) => {
      const profile = lead.borrowerProfile;
      return [lead.email, profile?.fullName, profile?.pan].some((value) => value?.toLowerCase().includes(term));
    });
  }, [data, search]);

  const columns: DataTableColumn<User>[] = [
    { key: "email", header: "Borrower", cell: (user) => user.email },
    { key: "name", header: "Name", cell: (user) => user.borrowerProfile?.fullName ?? "-" },
    { key: "pan", header: "PAN", cell: (user) => user.borrowerProfile?.pan ?? "-" },
    {
      key: "salary",
      header: "Salary",
      cell: (user) => (user.borrowerProfile ? formatCurrency(user.borrowerProfile.monthlySalary) : "-"),
    },
    { key: "created", header: "Registered", cell: (user) => formatDate(user.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Leads" description="Registered borrowers who have not completed a loan application." />
      <Input
        className="max-w-md"
        placeholder="Search by email, name or PAN"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          data={filteredLeads}
          columns={columns}
          emptyTitle="No leads found"
          emptyDescription="Borrowers without applications will appear here."
        />
      )}
    </div>
  );
}
