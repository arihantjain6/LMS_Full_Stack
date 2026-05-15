"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthForm } from "@/components/forms/auth-form";
import { getDefaultRouteForRole } from "@/lib/auth/roles";
import type { AuthFormValues } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AuthFormValues) => {
    setLoading(true);

    try {
      const result = await authService.login(values);
      setSession(result.token, result.user);
      toast.success("Logged in successfully");
      router.replace(getDefaultRouteForRole(result.user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to continue to the loan management workspace."
      submitLabel="Sign in"
      footerLabel="New borrower?"
      footerHref="/register"
      footerAction="Create an account"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}
