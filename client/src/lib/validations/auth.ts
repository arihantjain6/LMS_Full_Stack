import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Enter a valid email").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthFormValues = z.infer<typeof authSchema>;
