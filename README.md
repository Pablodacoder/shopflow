# ShopFlow — CISC 3140 Final Project

A full-stack e-commerce app built to Tier 2 spec: Next.js (App Router) +
PostgreSQL/Prisma + JWT auth + layered architecture + caching + CI/CD +
structured logging/error tracking + security hardening.

## Quick start
```bash
npm install
cp .env.example .env      # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run prisma:seed       # optional demo data (admin@shopflow.dev / Admin123!)
npm run dev
```

## Where things live
| What | Where |
|------|-------|
| Architecture overview + design patterns | `docs/ARCHITECTURE.md` |
| API reference | `docs/API.md` |
| DB schema + normalization rationale | `docs/DB_SCHEMA.md` |
| Deployment guide | `docs/DEPLOYMENT.md` |
| Architectural decision records | `docs/adr/` |
| Required project artifacts (charter, sprint plan, security audit, etc.) | `docs/artifacts/` |
| Presentation layer | `app/` |
| Business logic | `lib/services/` |
| Data access | `lib/repositories/` |
| Design patterns (Singleton/Factory/Observer) | `lib/patterns/` |
| Tests | `tests/` |
| CI pipeline | `.github/workflows/ci.yml` |

## Tests
```bash
npm test
```

## Pages included
`/products` (browse + add to cart), `/cart` (edit quantities + checkout),
`/login`, `/register`, `/orders` (order history), `/admin` (role-gated
product creation + live metrics). All wired to the real API routes, with
loading states and error handling per page.

## What's scaffolded vs. what your team still needs to do
This gives you a working backbone hitting every Tier 2 rubric line item with
real, functioning code (not stubs) for auth, all core pages, the data layer,
caching, security middleware, CI, and all required docs/artifacts. Still
needs your team's actual work:
- Fill in real names/roles in `docs/artifacts/team-charter.md`
- Polish the visual design (current styling is inline and functional, not
  branded — a good task to split off to whoever's doing UI)
- Run and record actual load test results (`docs/artifacts/performance-test-results.md`)
- Get a live deployment (Vercel + Neon Postgres) fully working and capture
  real monitoring screenshots
- Update sprint plan velocity numbers as sprints actually close
- Record the final demo video
