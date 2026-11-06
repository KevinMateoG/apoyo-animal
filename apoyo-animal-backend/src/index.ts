/// <reference path="./cors.d.ts" />
import "dotenv/config";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { applicationName } from "./infrastructure/observability/config.ts";
import { httpMetricsMiddleware, metricsRegistry } from "./infrastructure/observability/metrics.ts";
import { logger } from "./infrastructure/observability/logger.ts";
import {
  errorMiddleware,
  notFoundHandler,
} from "./interface/middlewares/global.handlers.ts";
import animalsRoutes from "./interface/routers/animals.router.ts";
import authRoutes from "./interface/routers/auth.router.ts";
import speciesRoutes from "./interface/routers/species.router.ts";
import sponsorshipsRoutes from "./interface/routers/sponsorships.router.ts";
import uploadsRoutes from "./interface/routers/uploads.router.ts";
import usersRoutes from "./interface/routers/users.router.ts";

const app: Express = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env["ORIGIN_FRONTEND"] || "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "8mb" }));

app.get("/metrics", async (_req: Request, res: Response, next) => {
  try {
    res.setHeader("Content-Type", metricsRegistry.contentType);
    res.status(200).end(await metricsRegistry.metrics());
  } catch (error) {
    next(error);
  }
});

app.use(httpMetricsMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/sponsorships", sponsorshipsRoutes);
app.use("/api/uploads", uploadsRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

const PORT = Number(process.env["PORT"] || 3001);
if (!process.env["VERCEL"]) {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info("API listening", { port: PORT, application: applicationName });
    console.log(`Api running: http://localhost:${PORT}`);
  });
}

export default app;
