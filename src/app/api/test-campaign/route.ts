import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { Campaign } from "@/lib/entities/Campaign";

export async function POST(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    // Create a test campaign
    const testCampaign = campaignRepository.create({
      name: "Test Campaign",
      description: "This is a test campaign",
      platforms: JSON.stringify(["google", "facebook"]),
      objective: "awareness",
      budget: 100,
      targetAudience: JSON.stringify({
        age: { min: 18, max: 65 },
        gender: "all",
        interests: ["technology"],
        locations: ["United States"],
        languages: ["English"]
      }),
      creative: JSON.stringify({
        headline: "Test Headline",
        description: "Test Description",
        callToAction: "Learn More",
        websiteUrl: "https://example.com"
      }),
      schedule: JSON.stringify({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timezone: "UTC"
      }),
      settings: JSON.stringify({
        bidStrategy: "automatic",
        optimization: "conversions",
        delivery: "standard"
      }),
      status: "active",
      userId: "test-user-id",
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

    const savedCampaign = await campaignRepository.save(testCampaign);

    return NextResponse.json({
      success: true,
      message: "Test campaign created successfully",
      campaign: savedCampaign
    });
  } catch (error) {
    console.error("Test campaign creation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
