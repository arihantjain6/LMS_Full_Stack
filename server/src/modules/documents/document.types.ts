import type { DocumentType } from "../../constants/enums";
import type { Types } from "mongoose";

export interface StoredDocument {
  owner: Types.ObjectId;
  type: DocumentType;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
