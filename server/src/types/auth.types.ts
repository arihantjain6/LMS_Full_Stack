import type { UserRole } from "../constants/enums";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}
