import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppDataSource } from '@/lib/database';
import { RealAd } from '@/lib/entities/RealAd';
import { ConnectedAccount } from '@/lib/entities/ConnectedAccount';
import { geminiAI } from '@/lib/ai/gemini';
import { realAdsIntegrationService } from '@/lib/services/realAdsIntegration';

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // For testing purposes, allow requests without authentication
    // In production, you should uncomment the authentication check below
    /*
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */

    const { adIds, optimizationType = 'comprehensive' } = await request.json();

    if (!adIds || !Array.isArray(adIds) || adIds.length === 0) {
      return NextResponse.json({ 
        error: 'Ad IDs are required' 
      }, { status: 400 });
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const realAdRepo = AppDataSource.getRepository(RealAd);
    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);

    const optimizedAds = [];

    for (const adId of adIds) {
      // Find the ad
      const ad = await realAdRepo.findOne({
        where: { id: adId }
      });

      if (!ad) {
        continue;
      }

      // Get connected account
      const connectedAccount = await connectedAccountRepo.findOne({
        where: { id: ad.connectedAccountId }
      });

      if (!connectedAccount) {
        continue;
      }

      // Generate AI optimization using Gemini with real performance data
      const performanceData = {
        impressions: ad.impressions || 0,
        clicks: ad.clicks || 0,
        ctr: ad.ctr || 0,
        cpc: ad.cpc || 0,
        conversions: ad.conversions || 0,
        roas: ad.roas || 0
      };

      const originalAd = {
        headline: ad.headline,
        description: ad.description,
        callToAction: ad.callToAction,
        targetAudience: ad.targetAudience,
        keywords: ad.keywords
      };

      const optimizationResult = await geminiAI.optimizeAdWithRealData(
        originalAd,
        performanceData,
        ad.platform
      );

      // Enhanced optimization with real-time data
      const enhancedOptimization = {
        // Original ad data
        originalAd: {
          headline: ad.headline,
          description: ad.description,
          callToAction: ad.callToAction,
          keywords: ad.keywords,
          targetAudience: ad.targetAudience
        },
        
        // AI-generated improvements
        optimizedContent: {
          headline: optimizationResult.headline,
          description: optimizationResult.primaryText,
          callToAction: optimizationResult.callToAction,
          tagline: optimizationResult.tagline,
          valueProposition: optimizationResult.valueProposition
        },

        // Enhanced targeting and tags
        targeting: {
          keywords: optimizationResult.keywords || [],
          hashtags: optimizationResult.hashtags || [],
          emojis: optimizationResult.emojis || [],
          platformTags: optimizationResult.platformTags || [],
          industryTags: optimizationResult.industryTags || [],
          longTailKeywords: optimizationResult.longTailKeywords || [],
          negativeKeywords: optimizationResult.negativeKeywords || []
        },

        // Performance predictions
        performance: {
          estimatedCTR: optimizationResult.estimatedCTR || 2.5,
          estimatedCPC: optimizationResult.estimatedCPC || 1.5,
          performanceScore: optimizationResult.performanceScore || 75,
          improvementPotential: optimizationResult.improvementPotential || 25
        },

        // AI suggestions
        suggestions: optimizationResult.suggestions || [],
        urgency: optimizationResult.urgency || "Available now!",
        socialProof: optimizationResult.socialProof || "Join thousands of satisfied customers",
        benefits: optimizationResult.benefits || [],

        // Platform-specific optimizations
        platformOptimizations: {
          facebook: {
            emotionalTriggers: [
              "don't miss out", "limited time", "exclusive offer", "join thousands",
              "transform your life", "breakthrough results", "proven success"
            ],
            engagementTags: [
              "viral content", "trending now", "must see", "everyone's talking about",
              "social proof", "customer favorite", "5 star rated"
            ],
            actionTags: [
              "act now", "get started today", "unlock potential", "achieve goals",
              "boost results", "maximize performance", "accelerate growth"
            ]
          },
          google: {
            searchKeywords: optimizationResult.keywords?.slice(0, 10) || [],
            adExtensions: [
              "site links", "callouts", "structured snippets", "price extensions"
            ],
            qualityScoreFactors: [
              "relevance", "landing page experience", "expected click-through rate"
            ]
          }
        },

        // Real-time optimization
        realTimeOptimization: {
          currentPerformance: {
            impressions: ad.impressions || 0,
            clicks: ad.clicks || 0,
            conversions: ad.conversions || 0,
            ctr: ad.ctr || 0,
            cpc: ad.cpc || 0,
            roas: ad.roas || 0
          },
          optimizationSuggestions: [
            "Test different headlines for better CTR",
            "Optimize targeting based on performance data",
            "A/B test call-to-action buttons",
            "Improve ad relevance score",
            "Adjust bidding strategy for better ROI"
          ],
          nextSteps: [
            "Implement AI-generated headlines",
            "Update targeting with new keywords",
            "Test new creative variations",
            "Monitor performance for 48-72 hours",
            "Scale successful variations"
          ]
        }
      };

      // Update the ad with optimization data
      ad.aiAnalysis = JSON.stringify(enhancedOptimization);
      ad.generatedTags = optimizationResult.keywords || [];
      ad.improvementSuggestions = optimizationResult.suggestions || [];
      ad.lastUpdated = new Date();
      
      await realAdRepo.save(ad);

      optimizedAds.push({
        adId: ad.id,
        platformAdId: ad.platformAdId,
        platform: ad.platform,
        name: ad.name,
        optimization: enhancedOptimization,
        status: 'optimized'
      });
    }

    return NextResponse.json({
      success: true,
      optimizedAds,
      message: `Successfully optimized ${optimizedAds.length} ads using AI`,
      totalOptimized: optimizedAds.length
    });

  } catch (error) {
    console.error('Error optimizing ads with AI:', error);
    return NextResponse.json(
      { error: 'Failed to optimize ads' },
      { status: 500 }
    );
  }
}

// Publish optimized ads back to platforms
export async function PUT(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // For testing purposes, allow requests without authentication
    // In production, you should uncomment the authentication check below
    /*
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */

    const { adId, optimizedContent } = await request.json();

    if (!adId || !optimizedContent) {
      return NextResponse.json({ 
        error: 'Ad ID and optimized content are required' 
      }, { status: 400 });
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const realAdRepo = AppDataSource.getRepository(RealAd);
    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);

    // Find the ad
    const ad = await realAdRepo.findOne({
      where: { id: adId }
    });

    if (!ad) {
      return NextResponse.json({ 
        error: 'Ad not found' 
      }, { status: 404 });
    }

    // Get connected account
    const connectedAccount = await connectedAccountRepo.findOne({
      where: { id: ad.connectedAccountId }
    });

    if (!connectedAccount) {
      return NextResponse.json({ 
        error: 'Connected account not found' 
      }, { status: 404 });
    }

    let publishResult;

    // Publish to the appropriate platform
    if (ad.platform === 'facebook') {
      publishResult = await realAdsIntegrationService.updateFacebookAd(
        ad.platformAdId,
        connectedAccount.accessToken,
        {
          name: optimizedContent.headline || ad.name,
          message: optimizedContent.description,
          call_to_action_type: optimizedContent.callToAction,
          targeting: optimizedContent.targeting
        }
      );
    } else if (ad.platform === 'google') {
      publishResult = await realAdsIntegrationService.updateGoogleAd(
        ad.platformAdId,
        connectedAccount.accessToken,
        {
          headline: optimizedContent.headline,
          description: optimizedContent.description,
          final_urls: [optimizedContent.finalUrl || ad.finalUrl],
          keywords: optimizedContent.targeting?.keywords || []
        }
      );
    }

    // Update ad in database with published changes
    ad.headline = optimizedContent.headline || ad.headline;
    ad.description = optimizedContent.description || ad.description;
    ad.callToAction = optimizedContent.callToAction || ad.callToAction;
    ad.keywords = optimizedContent.targeting?.keywords || ad.keywords;
    ad.lastUpdated = new Date();
    ad.status = 'active';
    
    await realAdRepo.save(ad);

    return NextResponse.json({
      success: true,
      message: 'Ad published successfully',
      publishResult,
      ad: {
        id: ad.id,
        platformAdId: ad.platformAdId,
        platform: ad.platform,
        name: ad.name,
        status: ad.status,
        lastUpdated: ad.lastUpdated
      }
    });

  } catch (error) {
    console.error('Error publishing optimized ad:', error);
    return NextResponse.json(
      { error: 'Failed to publish ad' },
      { status: 500 }
    );
  }
}
