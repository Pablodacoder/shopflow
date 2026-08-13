# ShopFlow — Database Schema

Full source of truth: `prisma/schema.prisma`. Summary + normalization
rationale below.

## Entities

| Table       | Purpose                                    |
|-------------|---------------------------------------------|
| User        | Accounts; `role` enum drives authorization |
| Category    | Product grouping                           |
| Product     | Catalog items; references Category         |
| Order       | One per checkout; references User          |
| OrderItem   | Line items; references Order + Product     |
| Review      | Product reviews; references Product + User |

## Normalization (3NF)

- **1NF**: every column atomic (no comma-separated lists, no repeating groups).
- **2NF**: composite-key tables (`OrderItem`) have no partial dependencies —
  `quantity` and `unitPriceCents` depend on the whole `(orderId, productId)`
  pairing, not on either alone.
- **3NF**: no transitive dependencies. Category name/slug live only in
  `Category`, not duplicated onto `Product`. `unitPriceCents` on `OrderItem`
  is a deliberate historical snapshot (not a normalization violation) — it
  preserves what the customer actually paid even if the product's price
  changes later.

## Indexes and why

| Table     | Index                | Reason |
|-----------|----------------------|--------|
| User      | `email` (unique)     | Login lookups; also enforces uniqueness |
| Category  | `slug` (unique)      | Catalog filter by URL slug |
| Product   | `categoryId`         | "browse by category" queries |
| Product   | `name`               | Search-by-name queries |
| Product   | `priceCents`         | Price-range filter/sort |
| Order     | `userId`             | "my orders" queries |
| Order     | `status`             | Admin dashboard filters by status |
| Order     | `createdAt`          | Revenue-by-day aggregation |
| OrderItem | `orderId`, `productId` | Join performance on both directions |
| Review    | `productId`, unique `(productId, userId)` | Product review listing + one-review-per-user rule |

## Migrations

Managed by Prisma Migrate (`prisma/migrations/`). To generate a new one after
editing `schema.prisma`:

```bash
npx prisma migrate dev --name <description>
```

CI runs `prisma migrate deploy` against a throwaway Postgres service
container so schema drift breaks the build, not production.

## Complex queries

Two raw SQL queries demonstrate joins + aggregation beyond basic CRUD:

- `productRepository.topSellingByCategory()` — units sold and revenue per
  product, joined across OrderItem → Product → Category, grouped and ranked.
- `orderRepository.revenueByDay()` — daily revenue/order-count for the
  trailing 30 days, excluding cancelled orders.
