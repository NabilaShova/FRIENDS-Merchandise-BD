import { NextResponse } from "next/server";
import { listCategories } from "@/server/repo";

/** GET /api/categories — all storefront categories. */
export async function GET() {
  return NextResponse.json({ categories: await listCategories() });
}
