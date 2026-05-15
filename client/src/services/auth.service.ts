import { apiClient, unwrap } from "@/lib/api/axios";
import type { AuthFormValues } from "@/lib/validations/auth";
import type { AuthResponse, User } from "@/types/domain";

export const authService = {
  register: (payload: AuthFormValues) =>
    unwrap<AuthResponse>(apiClient.post("/auth/register", payload)),
  login: (payload: AuthFormValues) => unwrap<AuthResponse>(apiClient.post("/auth/login", payload)),
  me: () => unwrap<User>(apiClient.get("/auth/me")),
};
