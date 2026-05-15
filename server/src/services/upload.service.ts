import { Types } from "mongoose";

import { config } from "../config/env";
import { DocumentType } from "../constants/enums";
import type { DocumentRepository } from "../repositories/document.repository";
import { AppError } from "../utils/app-error";

export class UploadService {
  public constructor(private readonly documentRepository: DocumentRepository) {}

  public async storeSalarySlip(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
  }> {
    if (!file) {
      throw new AppError("Salary slip file is required", 400);
    }

    const url = `${config.uploadBaseUrl}/${encodeURIComponent(file.filename)}`;
    const document = await this.documentRepository.create({
      owner: new Types.ObjectId(userId),
      type: DocumentType.SALARY_SLIP,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url,
    });

    return {
      id: String(document._id),
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      path: document.path,
      url: document.url,
    };
  }
}
