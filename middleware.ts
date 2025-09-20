import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // 1. Redirect authenticated users from the homepage to their dashboard
  if (pathname === '/') {
    if (isLoggedIn) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      if (role === 'agent') {
        return NextResponse.redirect(new URL('/agent/dashboard', req.url));
      }
    }
    // Allow unauthenticated users to see the homepage
    return NextResponse.next();
  }

  // 2. Protect the /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 3. Protect the /agent routes
  if (pathname.startsWith('/agent')) {
    if (!isLoggedIn || role !== 'agent') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If the path is not matched by any of the above, allow it
  return NextResponse.next();
});

// 4. Update the matcher to include the homepage
export const config = {
  matcher: ['/', '/admin/:path*', '/agent/:path*'],
};