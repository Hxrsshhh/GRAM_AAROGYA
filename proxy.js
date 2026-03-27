import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  /* ---------- 1. SKIP STATIC & INTERNAL ROUTES ---------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/auth/error" ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  const publicPaths = ["/", "/signin", "/signup", "/auth/error", "/helpdesk"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  /* ---------- 2. AUTH CHECK ---------- */
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  /* ---------- 3. FETCH USER STATUS (REAL-TIME) ---------- */
  let userData = null;

  if (token && !pathname.startsWith("/api")) {
    try {
      const baseUrl = request.nextUrl.origin;

      const res = await fetch(
        `${baseUrl}/api/user/status?id=${token.id || token.sub}&t=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Pragma: "no-cache",
          },
        }
      );

      if (res.ok) {
        userData = await res.json();
      }
    } catch (err) {
      console.error("Middleware fetch failed:", err.message);
    }
  }

  /* ---------- 4. BLOCK / DELETE CHECK ---------- */
  if (userData) {
    if (userData.status === "blocked" || userData.status === "deleted") {
      const errorType =
        userData.status === "deleted"
          ? "USER_DELETED"
          : "ACCESS_DENIED_BLOCKED";

      const response = NextResponse.redirect(
        new URL(`/auth/error?error=${errorType}`, request.url)
      );

      const cookieOptions = { maxAge: 0, path: "/" };
      response.cookies.set("next-auth.session-token", "", cookieOptions);
      response.cookies.set("__Secure-next-auth.session-token", "", cookieOptions);

      response.headers.set("Cache-Control", "no-store, max-age=0");

      return response;
    }
  }

  /* ---------- 5. ONBOARDING CHECK (FINAL FIX) ---------- */
  if (userData) {
    const onboardingStatus = userData.onboardingStatus;

    // 🔥 Handles first signup + pending users
    if (!onboardingStatus || onboardingStatus === "pending") {
      if (pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }
  }

  /* ---------- 6. PREVENT AUTH PAGE ACCESS WHEN LOGGED IN ---------- */
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    const roleRedirect = token.role === "admin" ? "/admin" : "/home";
    return NextResponse.redirect(new URL(roleRedirect, request.url));
  }

  return NextResponse.next();
}

/* ---------- 7. MATCHER ---------- */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};