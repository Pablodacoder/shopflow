# Code Review Log

Track every merged PR here. Populate as your team actually opens PRs — this
is meant to be a running log, not filled in retroactively the night before.

| PR # | Title | Author | Reviewer | Key feedback | Resolution |
|------|-------|--------|----------|---------------|------------|
| #1 | Prisma schema + initial migration | | | e.g. "add index on Order.status" | Addressed in same PR |
| #2 | Auth service (JWT) | | | e.g. "don't leak whether email exists on login" | Fixed — unified error message |
| #3 | Product catalog + caching | | | | |
| #4 | Checkout / order placement | | | | |
| #5 | CI pipeline | | | | |

## Review checklist (apply to every PR)
- [ ] No direct `prisma` import outside `lib/repositories/`
- [ ] All user input validated with a Zod schema
- [ ] No secrets committed (check `.env` isn't staged)
- [ ] Tests added/updated for new logic
- [ ] Relevant doc updated (API.md / ARCHITECTURE.md / DB_SCHEMA.md)
