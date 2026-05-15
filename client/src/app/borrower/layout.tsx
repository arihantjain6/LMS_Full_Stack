import type { ReactNode } from "react";

import { AppShell } from "@/components/layouts/app-shell";
import { ProtectedRoute } from "@/components/layouts/protected-route";

export default function BorrowerLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["BORROWER"]}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
