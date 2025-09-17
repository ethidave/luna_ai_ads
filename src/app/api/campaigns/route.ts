import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Campaign } from "@/lib/entities/Campaign";
import { PlatformIntegrationService } from "@/lib/services/platformIntegration";

// GET /api/campaigns - Get all campaigns for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin users don't have campaigns
    if (session.user.isAdmin) {
      return NextResponse.json({ 
        campaigns: [],
        message: "Admin users don't have campaigns" 
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    const campaigns = await campaignRepository.find({
      where: { user: { id: session.user.id } },
      relations: ['analytics', 'payments'],
      order: { createdAt: 'DESC' }
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      platforms,
      objective,
      budget,
      targetAudience,
      creative,
      schedule,
      settings
    } = body;

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    const campaign = campaignRepository.create({
      name,
      description,
      platforms: JSON.stringify(platforms),
      objective,
      budget: parseFloat(budget),
      targetAudience: JSON.stringify(targetAudience),
      creative: JSON.stringify(creative),
      schedule: JSON.stringify(schedule),
      settings: JSON.stringify(settings),
      status: 'active',
      user: { id: session.user.id },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        ctr: 0,
        cpc: 0,
        roas: 0
      }
    });

    const savedCampaign = await campaignRepository.save(campaign);

    // Integrate with actual ad platforms
    const platformResults = await PlatformIntegrationService.createCampaignsOnAllPlatforms({
      id: savedCampaign.id.toString(),
      name: savedCampaign.name,
      description: savedCampaign.description,
      platforms: JSON.parse(savedCampaign.platforms),
      objective: savedCampaign.objective,
      budget: savedCampaign.budget,
      targetAudience: JSON.parse(savedCampaign.targetAudience),
      creative: JSON.parse(savedCampaign.creative),
      schedule: JSON.parse(savedCampaign.schedule),
      settings: JSON.parse(savedCampaign.settings)
    });

    // Store platform results
    savedCampaign.platformResults = JSON.stringify(platformResults);
    await campaignRepository.save(savedCampaign);

    return NextResponse.json({ 
      campaign: savedCampaign,
      platformResults,
      message: "Campaign created successfully" 
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

