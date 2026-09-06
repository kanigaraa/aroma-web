import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/peta", "/komoditas", "/pengaturan"];
const AUTH_PAGES = ["/login", "/register"];
const ADMIN_ONLY = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ??
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  // RBAC: /admin requires admin role
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (!sessionToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Verify admin role from session cookie payload
    const isAdmin = req.cookies.get("better-auth.session_data")?.value;
    try {
      const sessionData = isAdmin ? JSON.parse(decodeURIComponent(isAdmin)) : null;
      if (!sessionData?.user?.role || sessionData.user.role !== "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!sessionToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && sessionToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/peta/:path*",
    "/komoditas/:path*",
    "/pengaturan/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
