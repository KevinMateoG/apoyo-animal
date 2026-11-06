import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from "@prometheus-io/client";
import type { RequestHandler } from "express";
import { applicationName } from "./config.ts";
import { logger } from "./logger.ts";
import { getRouteLabel } from "./route-label.ts";

export const metricsRegistry = new Registry();
metricsRegistry.setDefaultLabels({ application: applicationName });
collectDefaultMetrics({ register: metricsRegistry });

const httpRequestLabels = ["method", "route", "status_code"] as const;

const httpRequestsTotal = new Counter<(typeof httpRequestLabels)[number]>({
  name: "http_requests_total",
  help: "Total HTTP requests handled by the Apoyo Animal API.",
  labelNames: httpRequestLabels,
  registers: [metricsRegistry],
});

const httpRequestDuration = new Histogram<(typeof httpRequestLabels)[number]>({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds.",
  labelNames: httpRequestLabels,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const httpMetricsMiddleware: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.once("finish", () => {
    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode),
    };
    const elapsedSeconds = Number(process.hrtime.bigint() - startedAt) / 1e9;

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, elapsedSeconds);
    logger.info("HTTP request completed", {
      ...labels,
      duration_ms: Math.round(elapsedSeconds * 1_000),
    });
  });

  next();
};
