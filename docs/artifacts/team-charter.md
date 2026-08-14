# Team Charter — ShopFlow

## Team
| Name | Role | Primary responsibility |
|------|------|------------------------|
| Paul Cobourne | Tech Lead / Backend & DevOps | Repository setup, database, authentication, order service, deployment, CI/CD |
| Muhhammad Adeel Ashraf | Contributor | Feature enhancements and improvements |
| Ayan Khalliq | Frontend Contributor | Product image support and display |

## Working agreement
- **Communication**: group chat for day-to-day updates.
- **Branching**: `main` is always deployable. Feature branches
  `feat/<short-name>`, PR required before merge, at least 1 reviewer.
- **Commit style**: conventional commits (`feat:`, `fix:`, `docs:`, `test:`).
- **Meetings**: async check-ins via group chat.

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
