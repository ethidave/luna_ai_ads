import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No admin session found" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "fallback-secret"
      ) as any;

      // Verify it's an admin user
      if (!decoded.isAdmin || decoded.role !== "admin") {
        return NextResponse.json(
          { error: "Invalid admin session" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          isAdmin: decoded.isAdmin,
        }
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid admin token" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Admin session verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


