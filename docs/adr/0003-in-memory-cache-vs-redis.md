# ADR 0003: In-memory cache (Redis-shaped interface) over Redis directly

## Status
Accepted

## Context
Caching is a required feature. Standing up managed Redis adds external
infra + credentials to manage for a 4-person team on a hard deadline.

## Decision
Implement caching with `node-cache` behind a `CacheService` Singleton whose
interface (`get/set/del/invalidatePrefix`) matches what a Redis client would
expose.

## Consequences
**Positive:**
- Zero external dependency to provision before demo day.
- Swapping to Redis later is a one-file change (`lib/patterns/cache.js`)
  since nothing else touches the cache directly.

**Negative:**
- Cache doesn't survive restarts and isn't shared across instances —
  acceptable for a single-instance course deployment only.

## Alternatives considered
- **Redis (Upstash free tier)**: production-realistic, but adds a signup and
  a network dependency for a project graded within days. Documented as the
  next step in `docs/artifacts/known-issues-roadmap.md`.
