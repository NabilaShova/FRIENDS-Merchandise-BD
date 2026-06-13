import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Category } from "@/lib/types";

/** PUT /api/admin/categories/:slug — update a category (admin only). */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const category = (await request.json()) as Category;
  const updated = await updateCategory(slug, category);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category: updated });
}

/** DELETE /api/admin/categories/:slug — remove a category (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  return NextResponse.json({ ok: await deleteCategory(slug) });
}
