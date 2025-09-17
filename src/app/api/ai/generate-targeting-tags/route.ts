import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enhancedAdAnalysisService } from '@/lib/services/enhancedAdAnalysis';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      productName, 
      industry, 
      targetAudience, 
      platform, 
      objective 
    } = await request.json();

    if (!productName || !industry || !targetAudience || !platform || !objective) {
      return NextResponse.json({ 
        error: 'Missing required fields: productName, industry, targetAudience, platform, objective' 
      }, { status: 400 });
    }

    // Generate targeting tags
    const tags = await enhancedAdAnalysisService.generateTargetingTags(
      productName,
      industry,
      targetAudience,
      platform,
      objective
    );

    return NextResponse.json({
      success: true,
      tags
    });

  } catch (error) {
    console.error('Tag generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate targeting tags' },
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
    const productName = searchParams.get('productName') || 'Product';
    const industry = searchParams.get('industry') || 'Technology';
    const targetAudience = searchParams.get('targetAudience') || 'Business Owners';
    const platform = searchParams.get('platform') || 'facebook';
    const objective = searchParams.get('objective') || 'conversions';

    // Generate targeting tags
    const tags = await enhancedAdAnalysisService.generateTargetingTags(
      productName,
      industry,
      targetAudience,
      platform,
      objective
    );

    return NextResponse.json({
      success: true,
      tags
    });

  } catch (error) {
    console.error('Tag generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate targeting tags' },
      { status: 500 }
    );
  }
}
