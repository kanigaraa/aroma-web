import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/peta", "/komoditas", "/pengaturan"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ??
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  // /admin requires authentication (role check done client-side via useSession)
  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
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
