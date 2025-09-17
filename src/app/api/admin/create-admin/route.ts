import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      return NextResponse.json({
        success: true,
        message: "Admin credentials ready (database not configured)",
        credentials: {
          email: "admin@lunaai.com",
          password: "admin123"
        },
        setup: {
          database: "Not configured",
          status: "Ready for database setup",
          nextSteps: [
            "1. Set up PostgreSQL database",
            "2. Update .env file with database credentials",
            "3. Run: npm run migrate:admin",
            "4. Restart the development server"
          ]
        }
      });
    }

    // Initialize database
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@lunaai.com" }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        user: {
          id: existingAdmin.id,
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role,
          isAdmin: existingAdmin.role === 'admin',
        },
        credentials: {
          email: "admin@lunaai.com",
          password: "admin123"
        }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = userRepository.create({
      name: "Admin User",
      email: "admin@lunaai.com",
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isActive: true,
      emailVerified: true,
      plan: "enterprise",
    });

    const savedAdmin = await userRepository.save(adminUser);
    
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: savedAdmin.id,
        name: savedAdmin.name,
        email: savedAdmin.email,
        role: savedAdmin.role,
        isAdmin: savedAdmin.role === 'admin',
      },
      credentials: {
        email: "admin@lunaai.com",
        password: "admin123"
      }
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create admin user", 
        details: error instanceof Error ? error.message : "Unknown error",
        credentials: {
          email: "admin@lunaai.com",
          password: "admin123"
        }
      },
      { status: 500 }
    );
  }
}
