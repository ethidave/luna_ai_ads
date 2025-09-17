import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Analytics } from "@/lib/entities/Analytics";
import { User } from "@/lib/entities/User";
import { Campaign } from "@/lib/entities/Campaign";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      console.log("Analytics API: Unauthorized access attempt");
      return NextResponse.json({ 
        error: "Unauthorized", 
        message: "Admin privileges required",
        analytics: {
          totalRevenue: 0,
          totalUsers: 0,
          totalCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          revenueGrowth: 0,
          userGrowth: 0,
          campaignGrowth: 0,
          clickGrowth: 0,
          conversionGrowth: 0,
        },
        chartData: {
          revenue: [],
          users: [],
          campaigns: [],
          clicks: [],
          conversions: [],
        },
        platformData: [],
        recentActivity: [],
      }, { status: 401 });
    }

    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.log("Database environment variables not set, returning empty analytics data");
      return NextResponse.json({
        analytics: {
          totalRevenue: 0,
          totalUsers: 0,
          totalCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          revenueGrowth: 0,
          userGrowth: 0,
          campaignGrowth: 0,
          clickGrowth: 0,
          conversionGrowth: 0,
        },
        chartData: {
          revenue: [],
          users: [],
          campaigns: [],
          clicks: [],
          conversions: [],
        },
        platformData: [],
        recentActivity: [],
        message: "Database not configured. Please set up your database environment variables."
      });
    }

    // Initialize database if not already initialized
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Analytics API: Database initialized successfully");
      } catch (dbError) {
        console.error("Analytics API: Database initialization error:", dbError);
        return NextResponse.json({
          analytics: {
            totalRevenue: 0,
            totalUsers: 0,
            totalCampaigns: 0,
            totalClicks: 0,
            conversionRate: 0,
            revenueGrowth: 0,
            userGrowth: 0,
            campaignGrowth: 0,
            clickGrowth: 0,
            conversionGrowth: 0,
          },
          chartData: {
            revenue: [],
            users: [],
            campaigns: [],
            clicks: [],
            conversions: [],
          },
          platformData: [],
          recentActivity: [],
          error: "Database connection failed",
          message: "Please check your database configuration and ensure PostgreSQL is running."
        }, { status: 500 });
      }
    }

    const analyticsRepo = AppDataSource.getRepository(Analytics);
    const userRepo = AppDataSource.getRepository(User);
    const campaignRepo = AppDataSource.getRepository(Campaign);

    // Get all analytics data
    let analytics = [];
    try {
      analytics = await analyticsRepo.find({
        order: { createdAt: "DESC" }
      });
    } catch (dbError) {
      console.error("Analytics API: Error fetching analytics data:", dbError);
      // If there's a column error, return empty analytics array
      if (dbError.message && dbError.message.includes('column')) {
        console.log("Analytics API: Database schema may be out of sync, returning empty data");
        analytics = [];
      } else {
        throw dbError;
      }
    }

    // Get user count
    let totalUsers = 0;
    try {
      totalUsers = await userRepo.count();
    } catch (dbError) {
      console.error("Analytics API: Error fetching user count:", dbError);
      totalUsers = 0;
    }

    // Get campaign count
    let totalCampaigns = 0;
    try {
      totalCampaigns = await campaignRepo.count();
    } catch (dbError) {
      console.error("Analytics API: Error fetching campaign count:", dbError);
      totalCampaigns = 0;
    }

    // Calculate totals from analytics
    const totalRevenue = analytics.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalClicks = analytics.reduce((sum, item) => sum + (item.clicks || 0), 0);
    const totalConversions = analytics.reduce((sum, item) => sum + (item.conversions || 0), 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Calculate growth rates (mock for now - in real app, compare with previous period)
    const revenueGrowth = 12.5;
    const userGrowth = 8.3;
    const campaignGrowth = 15.2;
    const clickGrowth = 22.1;
    const conversionGrowth = 5.7;

    // Generate chart data (mock for now - in real app, aggregate by date)
    const chartData = {
      revenue: [
        { date: "2024-01-01", value: 1200 },
        { date: "2024-01-02", value: 1350 },
        { date: "2024-01-03", value: 1100 },
        { date: "2024-01-04", value: 1450 },
        { date: "2024-01-05", value: 1600 },
        { date: "2024-01-06", value: 1400 },
        { date: "2024-01-07", value: 1700 },
      ],
      users: [
        { date: "2024-01-01", value: 45 },
        { date: "2024-01-02", value: 52 },
        { date: "2024-01-03", value: 48 },
        { date: "2024-01-04", value: 61 },
        { date: "2024-01-05", value: 58 },
        { date: "2024-01-06", value: 67 },
        { date: "2024-01-07", value: 73 },
      ],
      campaigns: [
        { date: "2024-01-01", value: 12 },
        { date: "2024-01-02", value: 15 },
        { date: "2024-01-03", value: 13 },
        { date: "2024-01-04", value: 18 },
        { date: "2024-01-05", value: 16 },
        { date: "2024-01-06", value: 20 },
        { date: "2024-01-07", value: 22 },
      ],
      clicks: [
        { date: "2024-01-01", value: 1200 },
        { date: "2024-01-02", value: 1350 },
        { date: "2024-01-03", value: 1100 },
        { date: "2024-01-04", value: 1450 },
        { date: "2024-01-05", value: 1600 },
        { date: "2024-01-06", value: 1400 },
        { date: "2024-01-07", value: 1700 },
      ],
      conversions: [
        { date: "2024-01-01", value: 45 },
        { date: "2024-01-02", value: 52 },
        { date: "2024-01-03", value: 48 },
        { date: "2024-01-04", value: 61 },
        { date: "2024-01-05", value: 58 },
        { date: "2024-01-06", value: 67 },
        { date: "2024-01-07", value: 73 },
      ],
    };

    // Get top campaigns by revenue
    let topCampaigns = [];
    try {
      topCampaigns = await campaignRepo.find({
        order: { budget: "DESC" },
        take: 5,
        relations: ["user"]
      });
    } catch (dbError) {
      console.error("Analytics API: Error fetching top campaigns:", dbError);
      topCampaigns = [];
    }

    // Platform data from campaigns
    let platformStats = [];
    try {
      platformStats = await campaignRepo
        .createQueryBuilder("campaign")
        .select("campaign.platform, COUNT(*) as count")
        .groupBy("campaign.platform")
        .getRawMany();
    } catch (dbError) {
      console.error("Analytics API: Error fetching platform stats:", dbError);
      platformStats = [];
    }

    const totalPlatformCampaigns = platformStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const platformData = platformStats.map(stat => ({
      platform: stat.platform,
      value: parseInt(stat.count),
      color: stat.platform === "facebook" ? "bg-blue-500" : 
             stat.platform === "google" ? "bg-green-500" : 
             stat.platform === "instagram" ? "bg-pink-500" : "bg-purple-500",
      percentage: totalPlatformCampaigns > 0 ? Math.round((parseInt(stat.count) / totalPlatformCampaigns) * 100) : 0
    }));

    // Device data (mock for now - would need device tracking in real app)
    const deviceData = [
      { name: "Desktop", value: 65, color: "bg-blue-500", percentage: 65 },
      { name: "Mobile", value: 30, color: "bg-green-500", percentage: 30 },
      { name: "Tablet", value: 5, color: "bg-purple-500", percentage: 5 },
    ];

    // Recent activity
    const recentActivity = analytics.slice(0, 10).map((item, index) => ({
      id: item.id.toString(),
      type: "analytics",
      message: `Analytics update: ${item.platform} campaign`,
      timestamp: `${index + 1} minutes ago`,
      status: "success" as const,
    }));

    const analyticsData = {
      totalRevenue,
      totalUsers,
      totalCampaigns,
      totalClicks,
      conversionRate: Math.round(conversionRate * 100) / 100,
      revenueGrowth,
      userGrowth,
      campaignGrowth,
      clickGrowth,
      conversionGrowth,
    };

    console.log(`Processed analytics data successfully`);
    return NextResponse.json({ 
      analytics: analyticsData,
      chartData,
      platformData,
      topCampaigns,
      deviceData,
      recentActivity,
    });

  } catch (error) {
    console.error("Analytics API: Error fetching analytics:", error);
    return NextResponse.json(
      { 
        analytics: {
          totalRevenue: 0,
          totalUsers: 0,
          totalCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          revenueGrowth: 0,
          userGrowth: 0,
          campaignGrowth: 0,
          clickGrowth: 0,
          conversionGrowth: 0,
        },
        chartData: {
          revenue: [],
          users: [],
          campaigns: [],
          clicks: [],
          conversions: [],
        },
        platformData: [],
        recentActivity: [],
        error: "Failed to fetch analytics", 
        message: "An error occurred while processing analytics data",
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}