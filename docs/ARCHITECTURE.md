# ShopFlow — Architecture

## Layered structure

```
┌─────────────────────────────────────────────┐
│  Presentation Layer (app/)                   │
│  Next.js App Router pages + API routes       │
│  - Renders UI, parses requests               │
│  - No business rules, no direct DB access    │
└───────────────────┬───────────────────────────┘
                     │ calls
┌───────────────────▼───────────────────────────┐
│  Business Logic Layer (lib/services/)        │
│  - productService, orderService, authService │
│  - Validation orchestration, caching rules,  │
│    transactions, event emission              │
└───────────────────┬───────────────────────────┘
                     │ calls
┌───────────────────▼───────────────────────────┐
│  Data Layer (lib/repositories/)              │
│  - productRepository, orderRepository,       │
│    userRepository                            │
│  - Only files that import Prisma directly    │
└───────────────────┬───────────────────────────┘
                     │
              ┌──────▼──────┐
              │ PostgreSQL  │
              └─────────────┘
```

Cross-cutting concerns (`lib/patterns/`) — the Singleton DB client, Singleton
cache, Factory for notifications, and Observer for order events — sit beside
all three layers and are used by services, never bypassed by routes.

## Request flow (example: place an order)

1. `app/api/orders/route.js` (presentation) — parses JSON, validates with Zod,
   reads the JWT cookie.
2. `orderService.placeOrder()` (business logic) — opens a DB transaction,
   checks stock, computes totals.
3. `orderRepository` / direct `tx.*` calls (data layer) — persists rows.
4. `orderEvents.emit("statusChanged", ...)` (Observer) — notification, audit
   log, and cache-invalidation subscribers each react independently.

## Design patterns used

| Pattern   | Where                              | Why |
|-----------|-------------------------------------|-----|
| Singleton | `lib/patterns/db.js`, `cache.js`   | One Prisma client / one cache instance per process — avoids connection-pool exhaustion and fragmented cache state. |
| Factory   | `lib/patterns/notificationFactory.js` | Adding a new notification channel (SMS, push) means adding one class, not editing every call site. |
| Observer  | `lib/patterns/orderEvents.js`      | Order status changes trigger notification, audit logging, and cache invalidation without `orderService` knowing those consumers exist. |

## Caching strategy

In-memory (`node-cache`) with a 60s TTL on product catalog reads, keyed by
`category:search:page:pageSize`. Writes call `cache.invalidatePrefix("products:")`
so stale data can't outlive a mutation. The `CacheService` interface
(`get/set/del/invalidatePrefix`) is storage-agnostic — swapping in Redis means
changing the constructor in `cache.js` only.

## Security layers

- `middleware.js`: rate limiting (100 req/min/IP), CSRF double-submit cookie
  check, security headers (CSP, X-Frame-Options, HSTS).
- `lib/utils/validation.js`: Zod schemas reject malformed input before it
  reaches business logic; DOMPurify strips HTML from free-text fields.
- Prisma parameterizes all queries by default, eliminating SQL injection on
  the ORM path; the one raw query (`topSellingByCategory`) takes no
  user-supplied input.
- Passwords hashed with bcrypt (cost factor 12); JWTs signed HS256, 2h expiry.
