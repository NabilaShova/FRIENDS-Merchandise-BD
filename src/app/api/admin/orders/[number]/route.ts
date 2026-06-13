import { NextResponse } from "next/server";
import { setOrderStatus } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { PlacedOrder } from "@/lib/orders";

/** PATCH /api/admin/orders/:number — update fulfilment status (admin only). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { number } = await params;
  const { status } = (await request.json()) as { status: PlacedOrder["status"] };
  const updated = await setOrderStatus(decodeURIComponent(number), status);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order: updated });
}
