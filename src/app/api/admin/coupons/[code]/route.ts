import { NextResponse } from "next/server";
import { deleteCoupon, updateCoupon } from "@/server/repo";
import { requireAdmin } from "@/server/auth";
import type { Coupon } from "@/lib/coupons";

/** PUT /api/admin/coupons/:code — update a coupon (admin only). */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { code } = await params;
  const coupon = (await request.json()) as Coupon;
  const updated = await updateCoupon(decodeURIComponent(code), coupon);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ coupon: updated });
}

/** DELETE /api/admin/coupons/:code — remove a coupon (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { code } = await params;
  return NextResponse.json({ ok: await deleteCoupon(decodeURIComponent(code)) });
}
