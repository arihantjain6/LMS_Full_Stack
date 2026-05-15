import { apiClient, unwrap } from "@/lib/api/axios";
import type { UploadedDocument } from "@/types/domain";

export const uploadService = {
  uploadSalarySlip: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("salarySlip", file);

    return unwrap<UploadedDocument>(
      apiClient.post("/uploads/salary-slip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total || !onProgress) {
            return;
          }

          onProgress(Math.round((event.loaded * 100) / event.total));
        },
      }),
    );
  },
};
