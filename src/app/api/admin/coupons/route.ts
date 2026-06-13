import { NextResponse } from "next/server";
import { createCoupon } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Coupon } from "@/lib/coupons";

/** POST /api/admin/coupons — create a coupon (admin only). */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const coupon = (await request.json()) as Coupon;
  return NextResponse.json({ coupon: await createCoupon(coupon) }, { status: 201 });
}
