# ADR 0002: JWT-based authentication over server-side sessions

## Status
Accepted

## Context
The assignment allows either JWT or session-based auth. We need stateless
auth that works cleanly with serverless/edge deployment targets without a
sticky session store.

## Decision
Use JWT (HS256, 2h expiry) stored in an httpOnly, secure, sameSite=strict
cookie. Role is embedded as a claim and checked per-route via `requireRole()`.

## Consequences
**Positive:**
- No server-side session store needed — simpler infra, works serverless/edge.
- Stateless verification (`verifyToken`) is fast and doesn't hit the DB.

**Negative:**
- Revocation before expiry is hard — mitigated by a short 2h expiry.
- Token size is larger than a session ID, negligible at our scale.

## Alternatives considered
- **Session-based (DB/Redis-backed)**: easier instant revocation, but
  requires a stateful session store we don't otherwise need. Rejected for
  added infra complexity without a corresponding benefit at this scale.
