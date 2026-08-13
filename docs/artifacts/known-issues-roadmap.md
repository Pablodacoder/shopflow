# Known Issues & Future Roadmap

## Known issues (scope cut for the course deadline)
- In-memory cache and rate limiter are per-instance — won't work correctly
  behind a horizontally-scaled multi-instance deployment (see ADR 0003).
- No JWT revocation before expiry (2h window is the mitigation).
- Cart is not yet persisted server-side between sessions (frontend-only
  scaffold provided; team should decide localStorage vs. DB-backed cart).
- No pagination UI on the frontend yet (API supports it via `page`/`pageSize`).
- No automated load-testing in CI (run manually per `performance-test-results.md`).

## Roadmap (post-course / extra credit ideas)
- Swap in-memory cache for Redis (Upstash) — interface already supports it.
- Add Stripe integration for real payment processing.
- Add product image upload (S3/Cloudinary).
- Move rate limiting to a Redis-backed limiter for multi-instance safety.
- Add e2e tests (Playwright) covering the full checkout flow.
- Add an admin analytics dashboard using the `topSellingByCategory` /
  `revenueByDay` queries that already exist in the repositories.
