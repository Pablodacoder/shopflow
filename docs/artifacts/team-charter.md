# Team Charter — ShopFlow

## Team
| Name | Role | Primary responsibility |
|------|------|------------------------|
| [Your name] | Tech Lead / Backend | Auth, order service, CI/CD |
| [Teammate 2] | Frontend Lead | Product/cart/checkout UI, responsive design |
| [Teammate 3] | Data/Backend | Prisma schema, migrations, complex queries, caching |
| [Teammate 4] | QA / DevOps / Docs | Tests, load testing, monitoring, documentation |

*(Fill in real names — this table is the first thing to edit.)*

## Working agreement
- **Communication**: [Discord/Slack] channel for day-to-day; standup async
  each morning (what I did / what I'm doing / blockers).
- **Branching**: `main` is always deployable. Feature branches
  `feat/<short-name>`, PR required before merge, at least 1 reviewer.
- **Commit style**: conventional commits (`feat:`, `fix:`, `docs:`, `test:`).
- **Meetings**: sync check-in [2x/week], async updates otherwise.

## Decision-making
Technical decisions with more than one reasonable option get an ADR
(`docs/adr/`) before implementation starts, so disagreements get resolved in
writing, not in the group chat.

## Conflict resolution
Disagreement on approach → time-boxed discussion (15 min) → if unresolved,
tech lead makes the call and it gets documented in an ADR with the
dissenting option listed under "Alternatives considered."

## Definition of done
A feature is "done" when: code is merged to `main`, has passing tests, has
been reviewed by at least one teammate, and the relevant doc (API.md,
ARCHITECTURE.md, etc.) is updated if it changed behavior.
