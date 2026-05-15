export const LOAN_LIMITS = {
  MIN_AMOUNT: 50_000,
  MAX_AMOUNT: 500_000,
  MIN_TENURE_DAYS: 30,
  MAX_TENURE_DAYS: 365,
  INTEREST_RATE_PA: 12,
} as const;

export const BRE_LIMITS = {
  MIN_AGE: 23,
  MAX_AGE: 50,
  MIN_MONTHLY_SALARY: 25_000,
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ["application/pdf", "image/jpeg", "image/png"],
} as const;
