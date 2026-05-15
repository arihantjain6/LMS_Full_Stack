import { type ClientSession } from "mongoose";

import { AuditLogModel, type AuditLogDocument } from "../modules/auditLogs/audit-log.model";
import type { AuditLog } from "../modules/auditLogs/audit-log.types";

export class AuditLogRepository {
  public async create(
    data: Omit<AuditLog, "createdAt" | "updatedAt">,
    session?: ClientSession,
  ): Promise<AuditLogDocument> {
    const [auditLog] = await AuditLogModel.create([data], { session });

    if (!auditLog) {
      throw new Error("Failed to create audit log");
    }

    return auditLog;
  }
}
