import { NextResponse } from "next/server";
import { getSettings } from "@/server/repo";

/** GET /api/settings — public store settings (payment methods, bKash info). */
export async function GET() {
  return NextResponse.json({ settings: await getSettings() });
}
