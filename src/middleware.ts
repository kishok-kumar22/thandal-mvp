import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/config/auth";

/**
 * Lightweight edge middleware for basic routing guards.
 * 
 * IMPORTANT ARCHITECTURAL & SECURITY NOTE:
 * This middleware ONLY performs a coarse existence check for the `thandal_session` cookie
 * to prevent unnecessary rendering of protected layouts when unauthenticated.
 * 
 * The AUTHORITATIVE and cryptographically verified access control is enforced on the server
 * by `requireRole()`, `requireUser()`, and permission capabilities `can()`.
 * Never rely on this middleware alone for security enforcement.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin, agent, and customer application paths
  const isProtectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/agent") ||
    pathname.startsWith("/customer");

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/agent/:path*",
    "/customer/:path*",
  ],
};
