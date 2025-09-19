import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// This single line is the fix!
export const runtime = 'nodejs';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  const isLoggedIn = !!req.auth;

  const protectedRoutes = {
    "/admin": "admin",
    "/agent": "agent"
  };

  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      if (!isLoggedIn || req.auth?.user?.role !== protectedRoutes[route as keyof typeof protectedRoutes]) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*"],
};