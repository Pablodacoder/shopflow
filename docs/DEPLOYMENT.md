# ShopFlow — Deployment Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 14+ (managed: Neon, Supabase, Railway, or RDS)
- A hosting target with HTTPS termination (Vercel, Railway, Render, or a
  reverse proxy like Caddy/Nginx in front of a VM)

## 1. Environment variables
Copy `.env.example` → `.env` and fill in:
- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — long random string (`openssl rand -base64 48`)
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — from your Sentry project (optional but required for error tracking credit)

## 2. Install & migrate
```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed   # optional demo data
```

## 3. Build & run
```bash
npm run build
npm start   # serves on :3000
```

## 4. HTTPS
- **Vercel/Railway/Render**: HTTPS is automatic on the platform domain.
- **Self-hosted VM**: put Nginx or Caddy in front, terminate TLS there
  (Caddy will auto-provision Let's Encrypt certs with zero config), and
  proxy to `localhost:3000`.
- `middleware.js` already sets `Strict-Transport-Security`, so once HTTPS is
  live, browsers will enforce it on repeat visits.

## 5. CI/CD
`.github/workflows/ci.yml` runs lint + tests + build against a throwaway
Postgres service container on every push/PR to `main`/`develop`. Add a
deploy step (e.g. Vercel CLI or platform's GitHub integration) once you've
picked a host — most PaaS options auto-deploy on push to `main` without
needing anything added to this workflow.

## 6. Rollback
Because migrations are additive-first in this schema (no destructive
migrations yet), rollback = redeploy the previous Git commit/tag. If a
migration ever needs reverting, keep the corresponding down-migration SQL
in `prisma/migrations/<timestamp>/migration.sql` and apply it manually via
`psql $DATABASE_URL -f rollback.sql`.

## 7. Post-deploy checklist
- [ ] Hit `/api/metrics` — confirm `status: "ok"` and reasonable `dbLatencyMs`
- [ ] Confirm HTTPS padlock / no mixed-content warnings
- [ ] Trigger a test error, confirm it appears in Sentry
- [ ] Run a smoke test: register → login → browse products → place order
