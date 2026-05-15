import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface MoneyValueProps {
  value: number;
  className?: string;
}

export function MoneyValue({ value, className }: MoneyValueProps) {
  return <span className={cn("tabular-nums", className)}>{formatCurrency(value)}</span>;
}
