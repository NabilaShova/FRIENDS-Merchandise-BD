import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/prisma";

/** GET /api/health — readiness probe + active storage mode. */
export async function GET() {
  const storage = isDbConfigured()
    ? "postgres"
    : process.env.DATA_DIR
      ? "persistent-file"
      : "in-memory";
  return NextResponse.json({
    status: "ok",
    storage,
    timestamp: new Date().toISOString(),
  });
}
