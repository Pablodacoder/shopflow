import pino from "pino";

// Note: pino-pretty's worker-thread transport conflicts with Next.js's dev
// bundler (webpack can't resolve the worker script from inside .next/).
// Using plain synchronous pino output avoids that entirely — logs are still
// structured JSON, just not color-formatted in the terminal.
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: { service: "shopflow-api" },
  timestamp: pino.stdTimeFunctions.isoTime,
});