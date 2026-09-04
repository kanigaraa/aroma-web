import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/peta", "/komoditas", "/pengaturan"];
const AUTH_PAGES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("better-auth.session_token")
    ?? req.cookies.get("__Secure-better-auth.session_token");

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuth && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/peta/:path*", "/komoditas/:path*", "/pengaturan/:path*", "/login", "/register"],
};
