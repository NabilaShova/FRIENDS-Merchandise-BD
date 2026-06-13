import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin gate. Any `/admin/*` request without a valid session cookie is
 * redirected to the login page. This is a lightweight, server-side guard;
 * swap for NextAuth + a DB-backed ADMIN role check when auth is wired.
 */
export const ADMIN_COOKIE = "fmbd_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself through.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
