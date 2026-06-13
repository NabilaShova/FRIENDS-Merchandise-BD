import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/middleware";

/**
 * POST /api/admin/login — validates the admin password against ADMIN_PASSWORD
 * (defaults to "friends-admin" for the demo) and sets an httpOnly session
 * cookie. Replace with NextAuth credential/OAuth providers for production.
 */
export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  const expected = process.env.ADMIN_PASSWORD ?? "friends-admin";
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
