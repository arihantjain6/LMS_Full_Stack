import mongoose from "mongoose";

import { config } from "./env";
import { logger } from "./logger";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongodbUri);
  logger.info("MongoDB connected");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
