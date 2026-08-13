# ShopFlow — API Reference

Base URL: `/api`. All mutating requests require an `x-csrf-token` header
matching the `csrfToken` cookie (see middleware.js).

## Auth

### POST /api/auth/register
Body: `{ email, password (8-72 chars), name }`
→ `201 { user }`, sets httpOnly `token` cookie.

### POST /api/auth/login
Body: `{ email, password }`
→ `200 { user }`, sets httpOnly `token` cookie. `401` on bad credentials.

### POST /api/auth/logout
→ `200 { ok: true }`, clears the `token` cookie.

## Products

### GET /api/products?category=&q=&page=&pageSize=
Public. Cached 60s server-side.
→ `200 { items[], total, page, pageSize }`

### GET /api/products/:id
Public. Includes category + reviews.
→ `200 { ...product }` or `404`.

### POST /api/products
**Requires ADMIN role.**
Body: `{ sku, name, description, priceCents, stock, categoryId }`
→ `201 { ...product }`, `403` if not admin, `400` on validation failure.

## Categories

### GET /api/categories
Public.
→ `200 [{ id, name, slug }]`

## Orders

### GET /api/orders
**Requires auth.** Returns the caller's own orders.
→ `200 [{ ...order, items[] }]`, `401` if not logged in.

### POST /api/orders
**Requires auth.**
Body: `{ items: [{ productId, quantity }] }`
Runs inside a DB transaction: checks stock, decrements it, computes total.
→ `201 { ...order }`, `409` if stock insufficient, `404` if product missing.

### PATCH /api/orders/:id
**Requires ADMIN role.**
Body: `{ status: "PENDING"|"PAID"|"SHIPPED"|"DELIVERED"|"CANCELLED" }`
Emits an order-status-changed event (notification + audit log + cache bust).
→ `200 { ...order }`, `403` if not admin.

## Ops

### GET /api/metrics
Public health/perf snapshot: DB latency, uptime, memory. Point a monitor at
this on an interval to track API health.
