import { Types } from "mongoose";

import { DocumentModel, type StoredDocumentDocument } from "../modules/documents/document.model";
import type { StoredDocument } from "../modules/documents/document.types";
import { DocumentType } from "../constants/enums";

export class DocumentRepository {
  public async create(
    data: Omit<StoredDocument, "createdAt" | "updatedAt">,
  ): Promise<StoredDocumentDocument> {
    return DocumentModel.create(data);
  }

  public async findSalarySlipsByOwner(ownerId: string): Promise<StoredDocumentDocument[]> {
    return DocumentModel.find({
      owner: new Types.ObjectId(ownerId),
      type: DocumentType.SALARY_SLIP,
    })
      .sort({ createdAt: -1 })
      .exec();
  }
}
