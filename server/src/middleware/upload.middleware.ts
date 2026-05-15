import { mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";

import multer from "multer";

import { UPLOAD_LIMITS } from "../constants/loan.constants";
import { AppError } from "../utils/app-error";

const uploadDirectory = join(process.cwd(), "uploads");
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const salarySlipUpload = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    const isAllowedMimeType = UPLOAD_LIMITS.ALLOWED_MIME_TYPES.some(
      (mimeType) => mimeType === file.mimetype,
    );

    if (!isAllowedMimeType) {
      callback(new AppError("Only PDF, JPG and PNG files are allowed", 400));
      return;
    }

    callback(null, true);
  },
}).single("salarySlip");
