# ADR 0001: Next.js full-stack monolith over separate frontend/backend repos

## Status
Accepted

## Context
Team of 4, accelerated summer timeline, professor's required stack list
already specifies Next.js (App Router). We need to decide whether the API
lives inside the Next.js app (`app/api/*`) or as a separate Express/Node
service.

## Decision
Build the API as Next.js Route Handlers inside the same repo as the frontend.

## Consequences
**Positive:**
- One repo, one deploy, one CI pipeline — less coordination overhead for a
  4-person team on a tight deadline.
- Shared JS types/shapes between client and server without monorepo tooling.
- Matches the required tech stack exactly (Next.js App Router named
  explicitly).

**Negative:**
- Tighter coupling between frontend and backend than a fully separate
  service — harder to scale the API independently later.

## Alternatives considered
- **Separate Express backend + React frontend**: more "textbook" separation,
  but doubles deployment/CI surface area for no functional gain at this
  scale, and duplicates a lot of what Next.js API routes already give us.
