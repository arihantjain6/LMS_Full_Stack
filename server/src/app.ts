import { join } from "node:path";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { config } from "./config/env";
import { logger } from "./config/logger";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { loanRouter } from "./modules/loans/loan.routes";
import { paymentRouter } from "./modules/payments/payment.routes";
import { uploadRouter } from "./modules/uploads/upload.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "LMS API is healthy" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loans", loanRouter);
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/payments", paymentRouter);

app.use(notFoundHandler);
app.use(errorHandler);
