import { Schema, model, type HydratedDocument } from "mongoose";

import { DocumentType } from "../../constants/enums";
import type { StoredDocument } from "./document.types";

export type StoredDocumentDocument = HydratedDocument<StoredDocument>;

const documentSchema = new Schema<StoredDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: Object.values(DocumentType), required: true, index: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    path: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true },
);

export const DocumentModel = model<StoredDocument>("Document", documentSchema);
