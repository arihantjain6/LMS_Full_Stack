"use client";

import type { ReactNode } from "react";

import type { UserRole } from "@/types/domain";
import { useAuthStore } from "@/store/auth.store";

interface RoleGateProps {
  roles: UserRole[];
  children: ReactNode;
}

export function RoleGate({ roles, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user);

  if (!user || (user.role !== "ADMIN" && !roles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
