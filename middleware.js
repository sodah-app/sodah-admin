import { NextResponse } from "next/server";
export function middleware(req) {
  const url = req.nextUrl;
  // Existing dashboard protection
  if (url.pathname.startsWith("/dashboard")) {
    const blocked = req.cookies.get("blocked");

    if (blocked && blocked.value === "true") {
      return NextResponse.redirect(
        new URL("/subscription-expired", req.url)
      );
    }
  }
  // Admin protection
  if (url.pathname.startsWith("/admin")) {
    const adminToken = req.cookies.get("adminToken");

    if (!adminToken) {
      return NextResponse.redirect(
        new URL("/admin-login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};