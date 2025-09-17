import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { User } from "@/lib/entities/User";
import { Payment } from "@/lib/entities/Payment";
import { Campaign } from "@/lib/entities/Campaign";
import { Analytics } from "@/lib/entities/Analytics";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin users should also get real data, not mock data

    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.log("Database environment variables not set, returning empty dashboard data");
      return NextResponse.json({
        stats: {
          totalUsers: 0,
          totalRevenue: 0,
          activeCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          avgSessionTime: "0m 0s",
          serverUptime: "0%",
          apiCalls: 0,
        },
        chartData: [],
        recentActivity: [],
        message: "Database not configured. Please set up your database environment variables."
      });
    }

    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");
      } catch (dbError) {
        console.error("Database initialization error:", dbError);
        return NextResponse.json({
          stats: {
            totalUsers: 0,
            totalRevenue: 0,
            activeCampaigns: 0,
            totalClicks: 0,
            conversionRate: 0,
            avgSessionTime: "0m 0s",
            serverUptime: "0%",
            apiCalls: 0,
          },
          chartData: [],
          recentActivity: [],
          error: "Database connection failed",
          message: "Please check your database configuration and ensure PostgreSQL is running."
        });
      }
    }

    const userRepo = AppDataSource.getRepository(User);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const campaignRepo = AppDataSource.getRepository(Campaign);
    const analyticsRepo = AppDataSource.getRepository(Analytics);

    // Get total users
    const totalUsers = await userRepo.count();

    // Get total revenue from successful payments
    const totalRevenueResult = await paymentRepo
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: "completed" })
      .getRawOne();
    const totalRevenue = totalRevenueResult?.total || 0;

    // Get active campaigns
    const activeCampaigns = await campaignRepo.count({
      where: { status: "active" }
    });

    // Get total clicks from analytics
    const totalClicksResult = await analyticsRepo
      .createQueryBuilder("analytics")
      .select("SUM(analytics.clicks)", "total")
      .getRawOne();
    const totalClicks = totalClicksResult?.total || 0;

    // Get conversion rate (calculate from conversions and clicks)
    const conversionData = await analyticsRepo
      .createQueryBuilder("analytics")
      .select("AVG(CASE WHEN analytics.clicks > 0 THEN analytics.conversions::decimal / analytics.clicks ELSE 0 END)", "avgConversion")
      .getRawOne();
    const conversionRate = conversionData?.avgConversion || 0;

    // Get recent activity (last 10 activities)
    const recentActivity = await analyticsRepo
      .createQueryBuilder("analytics")
      .orderBy("analytics.createdAt", "DESC")
      .limit(10)
      .getMany();

    // Get platform distribution
    const platformData = await analyticsRepo
      .createQueryBuilder("analytics")
      .select("analytics.platform, COUNT(*)", "count")
      .groupBy("analytics.platform")
      .getRawMany();

    const chartData = platformData.map((item, index) => ({
      name: item.platform || "Unknown",
      value: parseInt(item.count),
      color: index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-pink-500"
    }));

    // If no data in database, return default chart data
    if (chartData.length === 0) {
      chartData.push(
        { name: "Facebook", value: 0, color: "bg-blue-500" },
        { name: "Google", value: 0, color: "bg-green-500" },
        { name: "Instagram", value: 0, color: "bg-pink-500" }
      );
    }

    // Calculate server uptime (mock for now - in real app, this would come from monitoring)
    const serverUptime = "99.9%";

    // Calculate average session time (mock for now)
    const avgSessionTime = "4m 32s";

    // Get API calls count (mock for now)
    const apiCalls = 1234567;

    const stats = {
      totalUsers,
      totalRevenue: Math.round(totalRevenue),
      activeCampaigns,
      totalClicks,
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgSessionTime,
      serverUptime,
      apiCalls,
    };

    // Generate recent activity if none exists
    let recentActivityData = recentActivity.map((activity, index) => ({
      id: activity.id.toString(),
      type: "analytics" as const,
      message: `Analytics update: ${activity.platform} campaign`,
      timestamp: `${index + 1} minutes ago`,
      status: "success" as const,
    }));

    // If no recent activity, create some default ones
    if (recentActivityData.length === 0) {
      recentActivityData = [
        {
          id: "1",
          type: "analytics" as const,
          message: "No recent activity - database is empty",
          timestamp: "Just now",
          status: "success" as const,
        }
      ];
    }

    console.log(`Dashboard data: ${totalUsers} users, ${totalRevenue} revenue, ${activeCampaigns} campaigns`);
    return NextResponse.json({
      stats,
      chartData,
      recentActivity: recentActivityData,
    });

  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
