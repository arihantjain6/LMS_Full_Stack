import { Schema, model, type HydratedDocument } from "mongoose";

import { AuditAction } from "../../constants/enums";
import type { AuditLog } from "./audit-log.types";

export type AuditLogDocument = HydratedDocument<AuditLog>;

const auditLogSchema = new Schema<AuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const AuditLogModel = model<AuditLog>("AuditLog", auditLogSchema);
