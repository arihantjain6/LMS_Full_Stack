import type { UserRole } from "@/types/domain";

export interface NavigationItem {
  href: string;
  label: string;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  { href: "/borrower/apply", label: "Apply", roles: ["BORROWER"] },
  { href: "/borrower/loans", label: "My Loans", roles: ["BORROWER"] },
  { href: "/dashboard/sales", label: "Sales", roles: ["ADMIN", "SALES"] },
  { href: "/dashboard/sanction", label: "Sanction", roles: ["ADMIN", "SANCTION"] },
  { href: "/dashboard/disbursement", label: "Disbursement", roles: ["ADMIN", "DISBURSEMENT"] },
  { href: "/dashboard/collection", label: "Collection", roles: ["ADMIN", "COLLECTION"] },
];

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (role === "ADMIN" && pathname.startsWith("/dashboard")) {
    return true;
  }

  if (role === "BORROWER") {
    return pathname.startsWith("/borrower");
  }

  if (pathname.startsWith("/borrower")) {
    return false;
  }

  return navigationItems.some((item) => pathname.startsWith(item.href) && item.roles.includes(role));
}

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationItems.filter((item) => item.roles.includes(role));
}

export function getDefaultRouteForRole(role: UserRole): string {
  if (role === "BORROWER") {
    return "/borrower/apply";
  }

  if (role === "SALES") {
    return "/dashboard/sales";
  }

  if (role === "SANCTION") {
    return "/dashboard/sanction";
  }

  if (role === "DISBURSEMENT") {
    return "/dashboard/disbursement";
  }

  if (role === "COLLECTION") {
    return "/dashboard/collection";
  }

  return "/dashboard/sales";
}
