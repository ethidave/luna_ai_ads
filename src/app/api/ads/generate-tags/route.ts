import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppDataSource } from '@/lib/database';
import { RealAd } from '@/lib/entities/RealAd';
import { geminiAI } from '@/lib/ai/gemini';

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

    // Generate tags based on ad content and platform
    const result = await geminiAI.generateAdCopy({
      productName: ad.headline || ad.name || 'Product',
      targetAudience: Array.isArray(ad.targetAudience) ? ad.targetAudience.join(', ') : (ad.targetAudience || 'General audience'),
      platform: ad.platform as any || 'google',
      objective: ad.objective as any || 'conversions',
      tone: 'professional' as any,
      industry: 'general'
    });

    const tags = result.keywords || [];

    // Update the ad with generated tags
    ad.generatedTags = tags;
    ad.lastUpdated = new Date();
    await realAdRepo.save(ad);

    return NextResponse.json({
      success: true,
      tags,
      message: 'Tags generated successfully'
    });

  } catch (error) {
    console.error('Error generating tags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
