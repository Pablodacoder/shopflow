# Monitoring Dashboard

This scaffold exposes `/api/metrics` (DB latency, uptime, memory) and wires
up Sentry for error tracking. The rubric asks for "monitoring dashboard
screenshots" — here's how your team gets real ones before submission:

## Option A — Sentry (error tracking + performance)
1. Create a free project at sentry.io, get the DSN.
2. Set `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` in your deployed environment.
3. Trigger a test error (e.g. temporarily throw in a route), confirm it
   shows up in the Sentry Issues dashboard.
4. Screenshot the Issues view and the Performance view → drop images here as
   `sentry-issues.png`, `sentry-performance.png`.

## Option B — Uptime/metrics dashboard
1. Point a free uptime monitor (e.g. UptimeRobot, Better Uptime) at
   `https://your-deployed-url/api/metrics`.
2. Let it collect data for at least a day before the demo.
3. Screenshot the resulting uptime/response-time graph → `uptime-dashboard.png`.

## Option C — Minimal, no external service
If time is short: screenshot `/api/metrics` JSON output itself, plus your
platform's built-in dashboard (Vercel Analytics, Railway metrics tab, etc.)
— most PaaS hosts show request volume/latency out of the box with zero
extra setup.

**Action item:** replace this file's instructions with actual embedded
screenshots (`![Sentry issues](./sentry-issues.png)`) once your team has a
live deployment.
