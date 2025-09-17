import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { websiteAnalysisService } from '@/lib/services/websiteAnalysis';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { websiteUrl } = await request.json();
    
    if (!websiteUrl) {
      return NextResponse.json({ 
        error: 'Website URL is required' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Invalid website URL format' 
      }, { status: 400 });
    }

    console.log('🔍 Analyzing website:', websiteUrl);

    // Analyze website
    const analysis = await websiteAnalysisService.analyzeWebsite(websiteUrl);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
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
    const websiteUrl = searchParams.get('websiteUrl');

    if (!websiteUrl) {
      return NextResponse.json({ 
        error: 'Website URL is required' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Invalid website URL format' 
      }, { status: 400 });
    }

    console.log('🔍 Analyzing website:', websiteUrl);

    // Analyze website
    const analysis = await websiteAnalysisService.analyzeWebsite(websiteUrl);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
