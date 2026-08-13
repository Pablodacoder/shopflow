// Error tracking integration (Production Operations requirement).
// Set SENTRY_DSN in your environment to activate; safe no-op without it.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
});
