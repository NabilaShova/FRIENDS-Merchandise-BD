import { NextResponse } from "next/server";
import { listProducts } from "@/server/repo";

/** GET /api/products — list products (filter by ?category=&featured=). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let products = await listProducts();
  if (category) products = products.filter((p) => p.category === category);
  if (featured === "true") products = products.filter((p) => p.isFeatured);

  return NextResponse.json({ count: products.length, products });
}
