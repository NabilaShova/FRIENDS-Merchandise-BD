import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { PlacedOrder } from "@/lib/orders";

/** GET /api/orders — full order list (admin only). */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ orders: await listOrders() });
}

/** POST /api/orders — place an order (public checkout). */
export async function POST(request: Request) {
  const order = (await request.json()) as PlacedOrder;
  if (!order?.number || !order.items?.length) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  return NextResponse.json({ order: await createOrder(order) }, { status: 201 });
}
