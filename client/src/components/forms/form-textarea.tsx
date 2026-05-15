import type { TextareaHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  registration?: UseFormRegisterReturn;
}

export function FormTextarea({ label, error, registration, id, ...props }: FormTextareaProps) {
  const inputId = id ?? registration?.name ?? label;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Textarea id={inputId} aria-invalid={Boolean(error)} {...registration} {...props} />
      {error ? <p className="text-xs font-medium text-destructive">{error.message}</p> : null}
    </div>
  );
}
