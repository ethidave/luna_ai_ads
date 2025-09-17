import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { realAdsIntegrationService } from '@/lib/services/realAdsIntegration';
import { AppDataSource } from '@/lib/database';
import { ConnectedAccount } from '@/lib/entities/ConnectedAccount';
import { RealAd } from '@/lib/entities/RealAd';
import { withApiErrorHandling } from '@/lib/api-error-handler';

async function getRealAdsHandler(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database initialized for ads/real endpoint");
    }

    // For testing purposes, allow requests without authentication
    // In production, you should uncomment the authentication check below
    /*
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */
    
    // Use a default user ID for testing
    const userId = 1;

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const forceRefresh = searchParams.get('refresh') === 'true';

    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);
    const realAdRepo = AppDataSource.getRepository(RealAd);

    // Get connected accounts
    const whereClause: any = { userId: userId, status: 'active' };
    if (platform && platform !== 'all') {
      whereClause.platform = platform;
    }

    const connectedAccounts = await connectedAccountRepo.find({
      where: whereClause
    });

    if (connectedAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        ads: [],
        message: 'No connected accounts found. Please connect your Facebook or Google Ads account first.'
      });
    }

    let allAds: any[] = [];

    // Fetch ads from each connected account
    for (const account of connectedAccounts) {
      try {
        let platformAds: any[] = [];

        if (account.platform === 'facebook') {
          platformAds = await realAdsIntegrationService.fetchFacebookAds(
            account.accountId,
            account.accessToken
          );
        } else if (account.platform === 'google') {
          // Refresh token if needed
          let accessToken = account.accessToken;
          if (account.refreshToken) {
            try {
              accessToken = await realAdsIntegrationService.refreshGoogleToken(account.refreshToken);
              // Update the access token in database
              account.accessToken = accessToken;
              await connectedAccountRepo.save(account);
            } catch (error) {
              console.error('Token refresh failed:', error);
              // Continue with existing token
            }
          }

          platformAds = await realAdsIntegrationService.fetchGoogleAds(
            account.accountId,
            accessToken
          );
        }

        // Save/update ads in database
        for (const adData of platformAds) {
          const existingAd = await realAdRepo.findOne({
            where: {
              platformAdId: adData.id,
              platform: adData.platform,
              connectedAccountId: account.id
            }
          });

          if (existingAd) {
            // Update existing ad
            Object.assign(existingAd, {
              name: adData.name,
              status: adData.status,
              objective: adData.objective,
              budget: adData.budget,
              spent: adData.spent,
              impressions: adData.impressions,
              clicks: adData.clicks,
              conversions: adData.conversions,
              ctr: adData.ctr,
              cpc: adData.cpc,
              roas: adData.roas,
              reach: adData.reach,
              frequency: adData.frequency,
              engagement: adData.engagement,
              headline: adData.headline,
              description: adData.description,
              callToAction: adData.callToAction,
              imageUrl: adData.imageUrl,
              videoUrl: adData.videoUrl,
              targetAudience: adData.targetAudience,
              keywords: adData.keywords,
              lastUpdated: new Date(),
              isActive: adData.realTimeData.isActive,
              performanceScore: adData.realTimeData.performanceScore,
              optimizationSuggestions: adData.realTimeData.optimizationSuggestions
            });

            await realAdRepo.save(existingAd);
            allAds.push(existingAd);
          } else {
            // Create new ad
            const realAd = realAdRepo.create({
              connectedAccountId: account.id,
              platformAdId: adData.id,
              platform: adData.platform,
              campaignId: adData.campaignId,
              adSetId: adData.adSetId,
              name: adData.name,
              status: adData.status,
              objective: adData.objective,
              budget: adData.budget,
              spent: adData.spent,
              impressions: adData.impressions,
              clicks: adData.clicks,
              conversions: adData.conversions,
              ctr: adData.ctr,
              cpc: adData.cpc,
              roas: adData.roas,
              reach: adData.reach,
              frequency: adData.frequency,
              engagement: adData.engagement,
              headline: adData.headline,
              description: adData.description,
              callToAction: adData.callToAction,
              imageUrl: adData.imageUrl,
              videoUrl: adData.videoUrl,
              targetAudience: adData.targetAudience,
              keywords: adData.keywords,
              lastUpdated: new Date(),
              isActive: adData.realTimeData.isActive,
              performanceScore: adData.realTimeData.performanceScore,
              optimizationSuggestions: adData.realTimeData.optimizationSuggestions
            });

            await realAdRepo.save(realAd);
            allAds.push(realAd);
          }
        }

        // Update last sync time
        account.lastSyncAt = new Date();
        await connectedAccountRepo.save(account);

      } catch (error) {
        console.error(`Failed to fetch ads from ${account.platform}:`, error);
        // Mark account as error
        account.status = 'error';
        account.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await connectedAccountRepo.save(account);
      }
    }

    // If not force refresh, get ads from database
    if (!forceRefresh) {
    const dbAds = await realAdRepo.find({
      where: {
        connectedAccountId: connectedAccounts.map(acc => acc.id)
      },
      order: { lastUpdated: 'DESC' }
    });

      allAds = dbAds;
    }

    return NextResponse.json({
      success: true,
      ads: allAds.map(ad => {
        const account = connectedAccounts.find(acc => acc.id === ad.connectedAccountId);
        return {
          id: ad.id,
          platformAdId: ad.platformAdId,
          platform: ad.platform,
          accountName: account?.accountName || 'Unknown Account',
          name: ad.name,
          status: ad.status,
          objective: ad.objective,
          budget: ad.budget,
          spent: ad.spent,
          impressions: ad.impressions,
          clicks: ad.clicks,
          conversions: ad.conversions,
          ctr: ad.ctr,
          cpc: ad.cpc,
          roas: ad.roas,
          reach: ad.reach,
          frequency: ad.frequency,
          engagement: ad.engagement,
          headline: ad.headline,
          description: ad.description,
          callToAction: ad.callToAction,
          imageUrl: ad.imageUrl,
          videoUrl: ad.videoUrl,
          targetAudience: ad.targetAudience,
          keywords: ad.keywords,
          lastUpdated: ad.lastUpdated,
          isActive: ad.isActive,
          performanceScore: ad.performanceScore,
          optimizationSuggestions: ad.optimizationSuggestions,
          aiAnalysis: ad.aiAnalysis,
          generatedTags: ad.generatedTags,
          improvementSuggestions: ad.improvementSuggestions,
          createdAt: ad.createdAt,
          updatedAt: ad.updatedAt
        };
      }),
      total: allAds.length,
      lastSync: connectedAccounts[0]?.lastSyncAt
    });

  } catch (error) {
    console.error('Failed to fetch real ads:', error);
    throw error; // Let the error handler deal with it
  }
}

export const GET = withApiErrorHandling(getRealAdsHandler);
