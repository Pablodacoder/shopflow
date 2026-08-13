// Lightweight metrics endpoint (Performance Monitoring requirement).
// Exposes request-timing and DB-latency snapshots. Point an uptime/monitoring
// tool (or a simple cron + dashboard) at this to track API health over time.

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/patterns/db";

export async function GET() {
  const start = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  const dbLatencyMs = performance.now() - start;

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbLatencyMs: Math.round(dbLatencyMs * 100) / 100,
    uptimeSeconds: process.uptime(),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
}
