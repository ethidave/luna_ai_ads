import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check for hardcoded admin user first
    if (email === "admin@lunaai.com" && password === "admin123") {
      const token = jwt.sign(
        {
          id: "admin-user-id",
          email: "admin@lunaai.com",
          name: "Admin User",
          role: "admin",
          isAdmin: true,
        },
        process.env.NEXTAUTH_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      );

      // Set secure HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        message: "Admin login successful",
        user: {
          id: "admin-user-id",
          email: "admin@lunaai.com",
          name: "Admin User",
          role: "admin",
          isAdmin: true,
        }
      });

      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    }

    // Try database authentication for admin users
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { 
          email: email,
          isAdmin: true // Only allow admin users
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials or insufficient privileges" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Update last login
      user.lastLoginAt = new Date();
      await userRepository.save(user);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
        },
        process.env.NEXTAUTH_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      );

      // Set secure HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        message: "Admin login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
        }
      });

      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;

    } catch (error) {
      console.error("Database admin auth error:", error);
      return NextResponse.json(
        { error: "Authentication service unavailable" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Admin signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


