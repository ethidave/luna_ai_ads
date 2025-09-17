import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test database connection
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");
      } catch (dbError) {
        console.error("Database initialization error:", dbError);
        return NextResponse.json({
          success: false,
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error"
        });
      }
    }

    // Test user repository
    const userRepo = AppDataSource.getRepository(User);
    const userCount = await userRepo.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount: userCount,
      databaseInitialized: AppDataSource.isInitialized
    });

  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: "Database test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
