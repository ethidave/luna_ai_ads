import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Campaign } from "@/lib/entities/Campaign";

// GET /api/campaigns/[id] - Get specific campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    const campaign = await campaignRepository.findOne({
      where: { 
        id: parseInt(params.id),
        user: { id: session.user.id }
      },
      relations: ['analytics', 'payments']
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, budget, settings } = body;

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    const campaign = await campaignRepository.findOne({
      where: { 
        id: parseInt(params.id),
        user: { id: session.user.id }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Update campaign fields
    if (status) campaign.status = status;
    if (budget) campaign.budget = parseFloat(budget);
    if (settings) campaign.settings = JSON.stringify(settings);

    const updatedCampaign = await campaignRepository.save(campaign);

    return NextResponse.json({ 
      campaign: updatedCampaign,
      message: "Campaign updated successfully" 
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const campaignRepository = AppDataSource.getRepository(Campaign);
    
    const campaign = await campaignRepository.findOne({
      where: { 
        id: parseInt(params.id),
        user: { id: session.user.id }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await campaignRepository.remove(campaign);

    return NextResponse.json({ 
      message: "Campaign deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

