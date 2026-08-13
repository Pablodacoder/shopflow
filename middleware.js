// Runs on every request. Handles:
// 1. Security headers (XSS/clickjacking mitigation)
// 2. Basic in-memory rate limiting (brute-force / DoS mitigation)
// 3. CSRF check on state-changing requests using a double-submit cookie
//
// Note: rate limiting here is in-memory per server instance — fine for a
// single-instance course deployment; swap for a Redis-backed limiter
// (e.g. @upstash/ratelimit) before running multiple instances in production.

import { NextResponse } from "next/server";

const rateLimitStore = new Map(); // ip -> { count, resetAt }
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

export function middleware(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (req.nextUrl.pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // CSRF: require matching header + cookie token on mutating requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const cookieToken = req.cookies.get("csrfToken")?.value;
      const headerToken = req.headers.get("x-csrf-token");
      if (!cookieToken || cookieToken !== headerToken) {
        return NextResponse.json({ error: "CSRF token invalid or missing" }, { status: 403 });
      }
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
