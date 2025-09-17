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
      currentCopy, 
      platform, 
      objective, 
      targetAudience 
    } = await request.json();

    if (!currentCopy || !platform || !objective || !targetAudience) {
      return NextResponse.json({ 
        error: 'Missing required fields: currentCopy, platform, objective, targetAudience' 
      }, { status: 400 });
    }

    // Generate ad copy suggestions
    const suggestions = await enhancedAdAnalysisService.generateAdCopySuggestions(
      currentCopy,
      platform,
      objective,
      targetAudience
    );

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Ad copy generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad copy suggestions' },
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
    const currentCopy = searchParams.get('currentCopy') || 'Our amazing product';
    const platform = searchParams.get('platform') || 'facebook';
    const objective = searchParams.get('objective') || 'conversions';
    const targetAudience = searchParams.get('targetAudience') || 'Business Owners';

    // Generate ad copy suggestions
    const suggestions = await enhancedAdAnalysisService.generateAdCopySuggestions(
      currentCopy,
      platform,
      objective,
      targetAudience
    );

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Ad copy generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad copy suggestions' },
      { status: 500 }
    );
  }
}
