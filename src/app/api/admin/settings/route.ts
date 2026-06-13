import { NextResponse } from "next/server";
import { updateSettings } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Settings } from "@/lib/settings";

/** PUT /api/admin/settings — update store settings (admin only). */
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const settings = (await request.json()) as Settings;
  return NextResponse.json({ settings: await updateSettings(settings) });
}
