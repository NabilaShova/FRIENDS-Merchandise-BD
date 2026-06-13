import { NextResponse } from "next/server";
import { validateCoupon } from "@/server/repo";

/** POST /api/coupons/validate — { code, subtotal } → discount or error. */
export async function POST(request: Request) {
  const { code, subtotal } = (await request.json().catch(() => ({}))) as {
    code?: string;
    subtotal?: number;
  };
  if (!code) return NextResponse.json({ ok: false, message: "Enter a code." });
  return NextResponse.json(await validateCoupon(code, Number(subtotal) || 0));
}
