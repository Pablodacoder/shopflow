# Security Audit Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Passwords hashed (bcrypt, cost ≥ 12) | ✅ | `lib/utils/auth.js` |
| JWT signed, short expiry, httpOnly/secure/sameSite cookie | ✅ | 2h expiry |
| Input validated server-side (Zod) on every mutating route | ✅ | `lib/utils/validation.js` |
| Free-text fields sanitized against stored XSS | ✅ | DOMPurify in `sanitize()` |
| SQL injection protection | ✅ | Prisma parameterizes all queries; raw SQL takes no user input |
| CSRF protection on state-changing requests | ✅ | Double-submit cookie in `middleware.js` |
| Rate limiting | ✅ | 100 req/min/IP in `middleware.js` |
| Security headers (CSP, X-Frame-Options, HSTS, nosniff) | ✅ | `middleware.js` |
| HTTPS enforced in production | ⬜ | Depends on host — see DEPLOYMENT.md §4 |
| Authorization checked per-route (not just authentication) | ✅ | `requireRole()` on admin-only routes |
| No secrets committed to repo | ⬜ | Verify `.env` is gitignored before submission |
| Dependency vulnerability scan | ⬜ | Run `npm audit` before final submission |
| Error messages don't leak internals (stack traces, DB errors) | ✅ | Generic error responses in production |

Legend: ✅ implemented in scaffold · ⬜ team must verify/complete before submission.
