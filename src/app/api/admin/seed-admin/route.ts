import { NextRequest, NextResponse } from "next/server";
import { seedAdminUser } from "@/lib/seed-admin";

export async function POST(request: NextRequest) {
  try {
    const adminUser = await seedAdminUser();
    
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        isAdmin: adminUser.isAdmin,
      },
      credentials: {
        email: "admin@lunaai.com",
        password: "admin123"
      }
    });
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create admin user", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
