"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { canAccessRoute, getDefaultRouteForRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/domain";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const roleAllowed = !allowedRoles || allowedRoles.includes(user.role) || user.role === "ADMIN";

    if (!roleAllowed || !canAccessRoute(user.role, pathname)) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [allowedRoles, hasHydrated, pathname, router, token, user]);

  if (!hasHydrated || !token || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground">Checking access...</div>
      </main>
    );
  }

  return <>{children}</>;
}
