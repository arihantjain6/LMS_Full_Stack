import type { ReactNode } from "react";

import { AppShell } from "@/components/layouts/app-shell";
import { ProtectedRoute } from "@/components/layouts/protected-route";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION"]}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
