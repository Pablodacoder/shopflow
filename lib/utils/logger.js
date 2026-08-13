// Structured logging (Production Operations requirement).
// JSON logs in production for ingestion by a log aggregator; pretty-printed
// in development for readability.

import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  base: { service: "shopflow-api" },
  timestamp: pino.stdTimeFunctions.isoTime,
});
