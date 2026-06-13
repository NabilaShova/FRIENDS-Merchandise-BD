import { NextResponse } from "next/server";
import { createCategory } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Category } from "@/lib/types";

/** POST /api/admin/categories — create a category (admin only). */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const category = (await request.json()) as Category;
  return NextResponse.json({ category: await createCategory(category) }, { status: 201 });
}
