import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  /* =========================
     PROTECTED ROUTES
  ========================== */

  if (
    url.pathname.startsWith(
      "/dashboard"
    )
  ) {
    const blocked =
      req.cookies.get(
        "blocked"
      );

    /* USER BLOCKED */

    if (
      blocked &&
      blocked.value === "true"
    ) {
      return NextResponse.redirect(
        new URL(
          "/subscription-expired",
          req.url
        )
      );
    }
  }

  return NextResponse.next();
}

/* =========================
   MATCHER
========================== */

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};