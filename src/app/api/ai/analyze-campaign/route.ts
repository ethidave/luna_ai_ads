import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enhancedAdAnalysisService } from '@/lib/services/enhancedAdAnalysis';
import { AppDataSource } from '@/lib/database';
import { Campaign } from '@/lib/entities/Campaign';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId } = await request.json();
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Get campaign from database
    const campaignRepository = AppDataSource.getRepository(Campaign);
    const campaign = await campaignRepository.findOne({
      where: { id: campaignId, userId: session.user.id },
      relations: ['user']
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Analyze campaign
    const analysis = await enhancedAdAnalysisService.analyzeCampaign(campaign);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Campaign analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze campaign' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Get campaign from database
    const campaignRepository = AppDataSource.getRepository(Campaign);
    const campaign = await campaignRepository.findOne({
      where: { id: campaignId, userId: session.user.id },
      relations: ['user']
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Analyze campaign
    const analysis = await enhancedAdAnalysisService.analyzeCampaign(campaign);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Campaign analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze campaign' },
      { status: 500 }
    );
  }
}
