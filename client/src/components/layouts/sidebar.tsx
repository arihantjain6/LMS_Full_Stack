"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, ClipboardCheck, CreditCard, Landmark, LayoutDashboard, WalletCards } from "lucide-react";

import { getNavigationForRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/lib/auth/roles";
import type { UserRole } from "@/types/domain";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Apply: Landmark,
  "My Loans": WalletCards,
  Sales: LayoutDashboard,
  Sanction: ClipboardCheck,
  Disbursement: Banknote,
  Collection: CreditCard,
};

interface SidebarProps {
  role: UserRole;
  onNavigate?: () => void;
}

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const items = getNavigationForRole(role);

  return (
    <aside className="flex h-full flex-col">
      <div className="px-2 pb-6">
        <div className="text-lg font-semibold text-foreground">CredirSea LMS</div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{role}</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} active={pathname.startsWith(item.href)} onNavigate={onNavigate} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: NavigationItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = icons[item.label] ?? LayoutDashboard;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
