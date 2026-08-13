# ADR 0004: Strict repository/service/route layering

## Status
Accepted

## Context
The rubric requires "clear separation of concerns (presentation, business
logic, data layers)." Without an enforced convention, a 4-person team will
naturally start calling Prisma directly from API routes under deadline
pressure, collapsing the layers.

## Decision
Enforce a one-directional call chain: `app/api/**/route.js` (presentation)
→ `lib/services/*` (business logic) → `lib/repositories/*` (data access,
the only files that import `prisma` directly). Code review checklist item:
reject any PR where a route file imports `lib/patterns/db.js` directly.

## Consequences
**Positive:**
- Business rules (caching, transactions, event emission) live in exactly
  one place per concern, not scattered across routes.
- Repositories can be unit-tested or mocked independently of HTTP.

**Negative:**
- Slightly more boilerplate for trivial CRUD (an extra function call per
  layer) than calling Prisma inline.

## Alternatives considered
- **Direct Prisma calls in routes**: faster to write initially, but fails
  the rubric's separation-of-concerns requirement outright and makes caching
  logic impossible to apply consistently.
