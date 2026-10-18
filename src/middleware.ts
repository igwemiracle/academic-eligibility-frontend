import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, api routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // Root redirect
  if (pathname === "/") {
    if (token) {
      // Let client router redirect to role home
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Public route
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protected routes: redirect if no token
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
