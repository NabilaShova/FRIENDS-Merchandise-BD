import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Product } from "@/lib/types";

/** PUT /api/admin/products/:id — update a product (admin only). */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const product = (await request.json()) as Product;
  const updated = await updateProduct(id, product);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: updated });
}

/** DELETE /api/admin/products/:id — remove a product (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  return NextResponse.json({ ok: await deleteProduct(id) });
}
