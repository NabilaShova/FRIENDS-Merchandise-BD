import { NextResponse } from "next/server";
import { createProduct } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Product } from "@/lib/types";

/** POST /api/admin/products — create a product (admin only). */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const product = (await request.json()) as Product;
  return NextResponse.json({ product: await createProduct(product) }, { status: 201 });
}
