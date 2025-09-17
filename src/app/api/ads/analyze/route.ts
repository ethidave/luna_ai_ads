import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppDataSource } from '@/lib/database';
import { RealAd } from '@/lib/entities/RealAd';
import { enhancedAdAnalysisService } from '@/lib/services/enhancedAdAnalysis';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { adId } = await request.json();

    if (!adId) {
      return NextResponse.json({ success: false, error: 'Ad ID is required' }, { status: 400 });
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const realAdRepo = AppDataSource.getRepository(RealAd);

    // Find the ad
    const ad = await realAdRepo.findOne({
      where: { id: adId }
    });

    if (!ad) {
      return NextResponse.json({ success: false, error: 'Ad not found' }, { status: 404 });
    }

    // Perform AI analysis
    const analysis = await enhancedAdAnalysisService.analyzeAd(ad);

    // Update the ad with analysis results
    ad.aiAnalysis = analysis;
    ad.lastUpdated = new Date();
    await realAdRepo.save(ad);

    return NextResponse.json({
      success: true,
      analysis,
      message: 'Ad analysis completed successfully'
    });

  } catch (error) {
    console.error('Error analyzing ad:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze ad',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
