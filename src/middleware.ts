import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Handle API routes differently
    if (pathname.startsWith("/api/admin")) {
      // For API routes, return JSON error instead of redirect
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Authentication required" },
          { status: 401 }
        );
      }

      if (token.role !== "admin" || !token.isAdmin) {
        return NextResponse.json(
          { error: "Forbidden", message: "Admin privileges required" },
          { status: 403 }
        );
      }

      return NextResponse.next();
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith("/admin")) {
      // Skip admin login page
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }

      // Check if user is authenticated
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Check if user is admin
      if (token.role !== "admin" || !token.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login?error=AccessDenied", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (
          pathname.startsWith("/auth") || 
          pathname === "/" || 
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/admin/auth")
        ) {
          return true;
        }

        // For API admin routes, always allow (we handle auth in the middleware function)
        if (pathname.startsWith("/api/admin")) {
          return true;
        }

        // For admin routes, check if user is authenticated and is admin
        if (pathname.startsWith("/admin")) {
          // Allow access to admin login page without authentication
          if (pathname === "/admin/login") {
            return true;
          }
          return !!token && token.role === "admin" && token.isAdmin;
        }

        // For other protected routes, just check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
};