import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    try {
      // Initialize database connection
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      // Check if user already exists
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
        credits: 100, // Give new users 100 free credits
      });

      await userRepository.save(newUser);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json(
        { 
          message: "User created successfully", 
          user: userWithoutPassword 
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error during registration:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed",
          message: "Unable to connect to the database. Please try again later or use the admin account: admin@lunaai.com / admin123",
          details: "Database connection error",
          fallback: true
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
        fallback: true
      },
      { status: 500 }
    );
  }
}