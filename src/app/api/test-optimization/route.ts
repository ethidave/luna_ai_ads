import { NextRequest, NextResponse } from 'next/server';
import { geminiAI } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const { testAd, testPerformance } = await request.json();

    // Test data if not provided
    const sampleAd = testAd || {
      headline: "Buy Our Product Now!",
      description: "The best product you'll ever use",
      callToAction: "Shop Now",
      targetAudience: "adults 25-45",
      keywords: ["product", "buy", "shop"]
    };

    const samplePerformance = testPerformance || {
      impressions: 1000,
      clicks: 25,
      ctr: 2.5,
      cpc: 2.0,
      conversions: 2,
      roas: 1.5
    };

    // Test the optimization
    const result = await geminiAI.optimizeAdWithRealData(
      sampleAd,
      samplePerformance,
      'facebook'
    );

    return NextResponse.json({
      success: true,
      originalAd: sampleAd,
      performance: samplePerformance,
      optimization: result,
      message: 'Test optimization completed successfully'
    });

  } catch (error) {
    console.error('Test optimization error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Test optimization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
