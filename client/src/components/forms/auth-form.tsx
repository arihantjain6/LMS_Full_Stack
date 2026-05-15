"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/forms/form-input";
import { authSchema, type AuthFormValues } from "@/lib/validations/auth";

interface AuthFormProps {
  title: string;
  description: string;
  submitLabel: string;
  footerLabel: string;
  footerHref: string;
  footerAction: string;
  loading: boolean;
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export function AuthForm({
  title,
  description,
  submitLabel,
  footerLabel,
  footerHref,
  footerAction,
  loading,
  onSubmit,
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email}
              registration={register("email")}
            />
            <FormInput
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
              registration={register("password")}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : submitLabel}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {footerLabel}{" "}
            <Link className="font-medium text-primary hover:underline" href={footerHref}>
              {footerAction}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
