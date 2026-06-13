import { NextResponse } from "next/server";
import { getOrder } from "@/server/repo";

/**
 * GET /api/orders/:number — fetch a single order by its number.
 * Used by the order-success page and the customer account area (the buyer
 * knows their own order numbers, stored client-side).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const order = await getOrder(decodeURIComponent(number));
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
