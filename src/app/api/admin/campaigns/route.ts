import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Campaign } from "@/lib/entities/Campaign";
import { User } from "@/lib/entities/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.log("Database environment variables not set, returning empty campaigns array");
      return NextResponse.json({ 
        campaigns: [],
        message: "Database not configured. Please set up your database environment variables."
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
            campaigns: [],
            error: "Database connection failed",
            message: "Please check your database configuration and ensure PostgreSQL is running."
          }
        );
      }
    }

    const campaignRepo = AppDataSource.getRepository(Campaign);
    const userRepo = AppDataSource.getRepository(User);

    // Get all campaigns with user information
    const campaigns = await campaignRepo.find({
      relations: ["user"],
      order: { createdAt: "DESC" }
    });

    console.log(`Found ${campaigns.length} campaigns in database`);

    // Transform campaigns to match the expected format
    const campaignsWithStats = campaigns.map((campaign) => ({
      id: campaign.id.toString(),
      name: campaign.name,
      platform: campaign.platform || "facebook",
      status: campaign.status || "draft",
      objective: campaign.objective || "Unknown",
      budget: campaign.budget || 0,
      spent: campaign.spent || 0,
      impressions: campaign.impressions || 0,
      clicks: campaign.clicks || 0,
      conversions: campaign.conversions || 0,
      ctr: campaign.ctr || 0,
      cpc: campaign.cpc || 0,
      roas: campaign.roas || 0,
      startDate: campaign.startDate?.toISOString().split('T')[0] || "Unknown",
      endDate: campaign.endDate?.toISOString().split('T')[0] || "Unknown",
      createdAt: campaign.createdAt?.toISOString().split('T')[0] || "Unknown",
      updatedAt: campaign.updatedAt?.toISOString().split('T')[0] || "Unknown",
      owner: campaign.user?.name || "Unknown User",
      tags: campaign.tags || [],
    }));

    console.log(`Processed ${campaignsWithStats.length} campaigns successfully`);
    return NextResponse.json({ campaigns: campaignsWithStats });

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { 
        campaigns: [],
        error: "Failed to fetch campaigns", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignData = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepo = AppDataSource.getRepository(Campaign);

    const newCampaign = campaignRepo.create({
      name: campaignData.name,
      platform: campaignData.platform,
      status: campaignData.status,
      objective: campaignData.objective,
      budget: campaignData.budget,
      spent: campaignData.spent || 0,
      impressions: campaignData.impressions || 0,
      clicks: campaignData.clicks || 0,
      conversions: campaignData.conversions || 0,
      ctr: campaignData.ctr || 0,
      cpc: campaignData.cpc || 0,
      roas: campaignData.roas || 0,
      startDate: campaignData.startDate ? new Date(campaignData.startDate) : null,
      endDate: campaignData.endDate ? new Date(campaignData.endDate) : null,
      tags: campaignData.tags || [],
      userId: campaignData.userId,
    });

    await campaignRepo.save(newCampaign);

    return NextResponse.json({ success: true, campaign: newCampaign });

  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
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

    const { campaignId, updates } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepo = AppDataSource.getRepository(Campaign);
    const existingCampaign = await campaignRepo.findOne({ where: { id: campaignId } });

    if (!existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Update campaign fields
    Object.assign(existingCampaign, updates);
    await campaignRepo.save(existingCampaign);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
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

    const { campaignId } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepo = AppDataSource.getRepository(Campaign);
    const existingCampaign = await campaignRepo.findOne({ where: { id: campaignId } });

    if (!existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await campaignRepo.remove(existingCampaign);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}