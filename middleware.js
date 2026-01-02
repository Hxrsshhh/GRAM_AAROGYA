// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/signin", "/signup"];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  /* ---------- NOT LOGGED IN ---------- */
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  /* ---------- LOGGED IN → AUTH PAGES ---------- */
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(token.role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  /* ---------- ADMIN PROTECTION ---------- */
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* ---------- ONBOARDING ENFORCEMENT ---------- */
  const onboardingAllowed =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  if (token?.onboardingStatus === "pending" && !onboardingAllowed) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
