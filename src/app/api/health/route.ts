import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint — no secrets are leaked (only booleans + the URL protocol).
 * Open https://<your-domain>/api/health to see what's misconfigured.
 */
export async function GET() {
  const report: Record<string, unknown> = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlProtocol: process.env.DATABASE_URL?.split("://")[0] ?? null,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV ?? null,
  };
  try {
    report.userCount = await prisma.user.count();
    report.db = "ok";
  } catch (e) {
    report.db = "error";
    report.dbError = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(report);
}
