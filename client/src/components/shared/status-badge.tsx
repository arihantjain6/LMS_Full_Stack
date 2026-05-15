import { Badge } from "@/components/ui/badge";
import type { LoanStatus } from "@/types/domain";

const statusVariant: Record<LoanStatus, "default" | "secondary" | "destructive" | "warning" | "success" | "info"> = {
  LEAD: "secondary",
  APPLIED: "info",
  SANCTIONED: "warning",
  REJECTED: "destructive",
  DISBURSED: "default",
  CLOSED: "success",
};

export function StatusBadge({ status }: { status: LoanStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
