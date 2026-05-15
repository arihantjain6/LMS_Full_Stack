"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getDefaultRouteForRole } from "@/lib/auth/roles";
import { useAuthStore } from "@/store/auth.store";

export default function HomePage() {
  const router = useRouter();
  const { token, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    router.replace(getDefaultRouteForRole(user.role));
  }, [hasHydrated, router, token, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm font-medium text-muted-foreground">Loading workspace...</div>
    </main>
  );
}
