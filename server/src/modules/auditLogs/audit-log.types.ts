import type { AuditAction } from "../../constants/enums";
import type { Types } from "mongoose";

export interface AuditLog {
  actor: Types.ObjectId;
  action: AuditAction;
  entityType: string;
  entityId: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
