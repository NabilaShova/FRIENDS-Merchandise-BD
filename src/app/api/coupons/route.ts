import { NextResponse } from "next/server";
import { listCoupons } from "@/server/repo";

/** GET /api/coupons — all coupons (used by the admin screen). */
export async function GET() {
  return NextResponse.json({ coupons: await listCoupons() });
}
