import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
  CORS_ORIGIN: z.string().default("*"),
  UPLOAD_BASE_URL: z.string().url().default("http://localhost:4000/uploads"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsedEnv = envSchema.parse(process.env);

export const config = {
  port: parsedEnv.PORT,
  mongodbUri: parsedEnv.MONGODB_URI,
  corsOrigin: parsedEnv.CORS_ORIGIN,
  uploadBaseUrl: parsedEnv.UPLOAD_BASE_URL,
  nodeEnv: parsedEnv.NODE_ENV,
  jwt: {
    secret: parsedEnv.JWT_SECRET,
    expiresIn: parsedEnv.JWT_EXPIRES_IN,
  },
} as const;
