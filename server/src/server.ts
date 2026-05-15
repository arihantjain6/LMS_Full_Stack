import { app } from "./app";
import { config } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./config/logger";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info({ port: config.port }, "LMS API server started");
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, "Shutting down server");
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void bootstrap().catch((error: unknown) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});
