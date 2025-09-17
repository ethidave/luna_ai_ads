import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";
import { Payment } from "@/lib/entities/Payment";
import { Campaign } from "@/lib/entities/Campaign";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ 
        error: "Unauthorized", 
        message: "Admin access required. Please log in as an admin user.",
        users: []
      }, { status: 401 });
    }

    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.log("Database environment variables not set, returning empty users array");
      return NextResponse.json({ 
        users: [],
        message: "Database not configured. Please set up your database environment variables.",
        totalUsers: 0,
        totalRevenue: 0,
        activeUsers: 0
      });
    }

    // Initialize database if not already initialized
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");
      } catch (dbError) {
        console.error("Database initialization error:", dbError);
        return NextResponse.json(
          { 
            users: [],
            error: "Database connection failed",
            message: "Please check your database configuration and ensure PostgreSQL is running.",
            totalUsers: 0,
            totalRevenue: 0,
            activeUsers: 0
          }
        );
      }
    }

    const userRepo = AppDataSource.getRepository(User);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const campaignRepo = AppDataSource.getRepository(Campaign);

    // Get all users with their related data
    const users = await userRepo.find({
      order: { createdAt: "DESC" }
    });

    console.log(`Found ${users.length} users in database`);

    // If no users found, return empty array
    if (users.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Get user statistics
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Get total spent
          const totalSpentResult = await paymentRepo
            .createQueryBuilder("payment")
            .select("SUM(payment.amount)", "total")
            .where("payment.userId = :userId AND payment.status = :status", {
              userId: user.id,
              status: "completed"
            })
            .getRawOne();

          // Get campaign count
          const campaignCount = await campaignRepo.count({
            where: { userId: user.id }
          });

          return {
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email,
            role: user.isAdmin ? "admin" : "user",
            status: user.isActive ? "active" : "inactive",
            plan: user.currentPlan || "starter",
            joinDate: user.createdAt?.toISOString().split('T')[0] || "Unknown",
            lastActive: user.lastLoginAt?.toISOString().split('T')[0] || "Never",
            totalSpent: parseFloat(totalSpentResult?.total) || 0,
            campaigns: campaignCount,
            avatar: user.avatar || undefined,
            phone: user.phone || undefined,
            location: "Unknown",
            verified: true,
          };
        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError);
          // Return basic user data if stats fail
          return {
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email,
            role: user.isAdmin ? "admin" : "user",
            status: user.isActive ? "active" : "inactive",
            plan: user.currentPlan || "starter",
            joinDate: user.createdAt?.toISOString().split('T')[0] || "Unknown",
            lastActive: user.lastLoginAt?.toISOString().split('T')[0] || "Never",
            totalSpent: 0,
            campaigns: 0,
            avatar: user.avatar || undefined,
            phone: user.phone || undefined,
            location: "Unknown",
            verified: true,
          };
        }
      })
    );

    console.log(`Processed ${usersWithStats.length} users successfully`);
    return NextResponse.json({ users: usersWithStats });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        users: [],
        error: "Failed to fetch users", 
        details: error instanceof Error ? error.message : "Unknown error",
        message: "An error occurred while fetching users. Please try again later.",
        totalUsers: 0,
        totalRevenue: 0,
        activeUsers: 0
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, updates } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.phone) user.phone = updates.phone;
    if (updates.isActive !== undefined) user.isActive = updates.isActive;
    if (updates.isAdmin !== undefined) user.isAdmin = updates.isAdmin;
    if (updates.currentPlan) user.currentPlan = updates.currentPlan;

    await userRepo.save(user);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await userRepo.remove(user);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}