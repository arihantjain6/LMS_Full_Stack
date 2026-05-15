"use client";

import type { ReactNode } from "react";
import { Menu, LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth.store";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { user, clearSession } = useAuthStore();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden fixed inset-y-0 left-0 w-72 border-r bg-card p-5 lg:block">
        <Sidebar role={user.role} />
      </div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <Sidebar role={user.role} />
            </SheetContent>
          </Sheet>
          <div className="hidden text-sm font-medium text-muted-foreground lg:block">Loan Management System</div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-48 truncate">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
