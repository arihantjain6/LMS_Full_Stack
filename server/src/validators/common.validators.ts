import { z } from "zod";

export const objectIdParamsSchema = z.object({
  loanId: z.string().min(1, "loanId is required"),
});
