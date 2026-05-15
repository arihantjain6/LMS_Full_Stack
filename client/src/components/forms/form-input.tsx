import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration?: UseFormRegisterReturn;
}

export function FormInput({ label, error, registration, id, ...props }: FormInputProps) {
  const inputId = id ?? registration?.name ?? label;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} aria-invalid={Boolean(error)} {...registration} {...props} />
      {error ? <p className="text-xs font-medium text-destructive">{error.message}</p> : null}
    </div>
  );
}
