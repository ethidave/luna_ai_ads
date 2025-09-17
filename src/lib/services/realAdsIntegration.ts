export interface FacebookAdAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  access_token: string;
  permissions: string[];
}

export interface GoogleAdsAccount {
  customerId: string;
  name: string;
  currency: string;
  timezone: string;
  access_token: string;
  refresh_token: string;
}

export interface RealAd {
  id: string;
  platform: 'facebook' | 'google';
  accountId: string;
  campaignId: string;
  adSetId?: string; // Facebook only
  name: string;
  status: 'active' | 'paused' | 'archived' | 'deleted';
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  reach: number;
  frequency: number;
  engagement: number;
  headline: string;
  description: string;
  callToAction: string;
  imageUrl?: string;
  videoUrl?: string;
  targetAudience: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  // Real-time data
  realTimeData: {
    lastUpdated: string;
    isActive: boolean;
    performanceScore: number;
    optimizationSuggestions: string[];
  };
}

export class RealAdsIntegrationService {
  private facebookApiUrl = 'https://graph.facebook.com/v18.0';
  private googleAdsApiUrl = 'https://googleads.googleapis.com/v14';

  /**
   * Connect Facebook Ads account
   */
  async connectFacebookAccount(accessToken: string): Promise<FacebookAdAccount> {
    try {
      // Get user's ad accounts
      const response = await fetch(`${this.facebookApiUrl}/me/adaccounts?access_token=${accessToken}&fields=id,name,currency,timezone,account_status,permissions`);
      const data = await response.json();

      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`);
      }

      const account = data.data[0]; // Get first account
      if (!account) {
        throw new Error('No Facebook ad accounts found');
      }

      return {
        id: account.id,
        name: account.name,
        currency: account.currency,
        timezone: account.timezone,
        access_token: accessToken,
        permissions: account.permissions || []
      };
    } catch (error) {
      console.error('Facebook connection failed:', error);
      throw error;
    }
  }

  /**
   * Connect Google Ads account
   */
  async connectGoogleAccount(accessToken: string, refreshToken: string): Promise<GoogleAdsAccount> {
    try {
      // Get customer list
      const response = await fetch(`${this.googleAdsApiUrl}/customers:listAccessibleCustomers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
        }
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Google Ads API Error: ${data.error.message}`);
      }

      const customerId = data.resourceNames[0]?.split('/').pop();
      if (!customerId) {
        throw new Error('No Google Ads accounts found');
      }

      // Get account details
      const accountResponse = await fetch(`${this.googleAdsApiUrl}/customers/${customerId}:getCustomer`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
        }
      });

      const accountData = await accountResponse.json();

      return {
        customerId,
        name: accountData.descriptiveName || `Account ${customerId}`,
        currency: accountData.currencyCode || 'USD',
        timezone: accountData.timeZone || 'UTC',
        access_token: accessToken,
        refresh_token: refreshToken
      };
    } catch (error) {
      console.error('Google Ads connection failed:', error);
      throw error;
    }
  }

  /**
   * Fetch real ads from Facebook
   */
  async fetchFacebookAds(accountId: string, accessToken: string): Promise<RealAd[]> {
    try {
      const response = await fetch(
        `${this.facebookApiUrl}/${accountId}/ads?access_token=${accessToken}&fields=id,name,status,objective,created_time,updated_time,insights{impressions,clicks,spend,ctr,cpc,conversions,reach,frequency,engagement}&limit=100`
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`);
      }

      return data.data.map((ad: any) => this.transformFacebookAd(ad));
    } catch (error) {
      console.error('Failed to fetch Facebook ads:', error);
      throw error;
    }
  }

  /**
   * Fetch real ads from Google Ads
   */
  async fetchGoogleAds(customerId: string, accessToken: string): Promise<RealAd[]> {
    try {
      const query = `
        SELECT 
          ad_group_ad.ad.id,
          ad_group_ad.ad.name,
          ad_group_ad.status,
          campaign.name,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions_value,
          ad_group_ad.ad.responsive_search_ad.headlines,
          ad_group_ad.ad.responsive_search_ad.descriptions
        FROM ad_group_ad 
        WHERE ad_group_ad.status IN ('ENABLED', 'PAUSED')
        AND campaign.status IN ('ENABLED', 'PAUSED')
        LIMIT 100
      `;

      const response = await fetch(`${this.googleAdsApiUrl}/customers/${customerId}/googleAds:search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Google Ads API Error: ${data.error.message}`);
      }

      return data.results.map((result: any) => this.transformGoogleAd(result));
    } catch (error) {
      console.error('Failed to fetch Google ads:', error);
      throw error;
    }
  }

  /**
   * Transform Facebook ad data to our format
   */
  private transformFacebookAd(ad: any): RealAd {
    const insights = ad.insights?.data?.[0] || {};
    
    return {
      id: ad.id,
      platform: 'facebook',
      accountId: ad.account_id || '',
      campaignId: ad.campaign_id || '',
      name: ad.name,
      status: this.mapFacebookStatus(ad.status),
      objective: ad.objective || 'unknown',
      budget: 0, // Will be fetched separately
      spent: parseFloat(insights.spend || '0'),
      impressions: parseInt(insights.impressions || '0'),
      clicks: parseInt(insights.clicks || '0'),
      conversions: parseInt(insights.conversions || '0'),
      ctr: parseFloat(insights.ctr || '0'),
      cpc: parseFloat(insights.cpc || '0'),
      roas: parseFloat(insights.roas || '0'),
      reach: parseInt(insights.reach || '0'),
      frequency: parseFloat(insights.frequency || '0'),
      engagement: parseFloat(insights.engagement || '0'),
      headline: ad.name, // Facebook doesn't have separate headline
      description: ad.name, // Will be fetched from ad creative
      callToAction: 'Learn More', // Will be fetched from ad creative
      targetAudience: [], // Will be fetched from ad set
      keywords: [], // Will be fetched from ad set
      createdAt: ad.created_time,
      updatedAt: ad.updated_time,
      realTimeData: {
        lastUpdated: new Date().toISOString(),
        isActive: ad.status === 'ACTIVE',
        performanceScore: this.calculatePerformanceScore(insights),
        optimizationSuggestions: this.generateOptimizationSuggestions(insights)
      }
    };
  }

  /**
   * Transform Google ad data to our format
   */
  private transformGoogleAd(result: any): RealAd {
    const ad = result.adGroupAd.ad;
    const metrics = result.metrics;
    const campaign = result.campaign;
    
    return {
      id: ad.id.toString(),
      platform: 'google',
      accountId: result.customer?.id || '',
      campaignId: campaign.id?.toString() || '',
      name: ad.name,
      status: this.mapGoogleStatus(result.adGroupAd.status),
      objective: this.mapGoogleObjective(campaign.advertisingChannelType),
      budget: 0, // Will be fetched separately
      spent: parseFloat(metrics.costMicros || '0') / 1000000,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      conversions: parseFloat(metrics.conversions || '0'),
      ctr: parseFloat(metrics.ctr || '0'),
      cpc: parseFloat(metrics.averageCpc || '0') / 1000000,
      roas: parseFloat(metrics.conversionsValue || '0') / parseFloat(metrics.costMicros || '1') * 1000000,
      reach: parseInt(metrics.impressions || '0'), // Google doesn't have separate reach
      frequency: 1.0, // Will be calculated
      engagement: parseFloat(metrics.ctr || '0'),
      headline: ad.responsiveSearchAd?.headlines?.[0]?.text || ad.name,
      description: ad.responsiveSearchAd?.descriptions?.[0]?.text || '',
      callToAction: 'Learn More', // Will be fetched from ad
      targetAudience: [], // Will be fetched from campaign
      keywords: [], // Will be fetched from ad group
      createdAt: new Date().toISOString(), // Google doesn't provide creation time
      updatedAt: new Date().toISOString(),
      realTimeData: {
        lastUpdated: new Date().toISOString(),
        isActive: result.adGroupAd.status === 'ENABLED',
        performanceScore: this.calculatePerformanceScore(metrics),
        optimizationSuggestions: this.generateOptimizationSuggestions(metrics)
      }
    };
  }

  /**
   * Map Facebook ad status
   */
  private mapFacebookStatus(status: string): 'active' | 'paused' | 'archived' | 'deleted' {
    switch (status) {
      case 'ACTIVE':
        return 'active';
      case 'PAUSED':
        return 'paused';
      case 'ARCHIVED':
        return 'archived';
      case 'DELETED':
        return 'deleted';
      default:
        return 'paused';
    }
  }

  /**
   * Map Google ad status
   */
  private mapGoogleStatus(status: string): 'active' | 'paused' | 'archived' | 'deleted' {
    switch (status) {
      case 'ENABLED':
        return 'active';
      case 'PAUSED':
        return 'paused';
      case 'REMOVED':
        return 'deleted';
      default:
        return 'paused';
    }
  }

  /**
   * Map Google objective
   */
  private mapGoogleObjective(channelType: string): string {
    switch (channelType) {
      case 'SEARCH':
        return 'conversions';
      case 'DISPLAY':
        return 'awareness';
      case 'VIDEO':
        return 'video_views';
      case 'SHOPPING':
        return 'conversions';
      default:
        return 'conversions';
    }
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(metrics: any): number {
    const ctr = parseFloat(metrics.ctr || '0');
    const roas = parseFloat(metrics.roas || '0');
    const conversions = parseFloat(metrics.conversions || '0');
    
    let score = 0;
    
    // CTR score (0-40 points)
    if (ctr > 3) score += 40;
    else if (ctr > 2) score += 30;
    else if (ctr > 1) score += 20;
    else if (ctr > 0.5) score += 10;
    
    // ROAS score (0-40 points)
    if (roas > 4) score += 40;
    else if (roas > 3) score += 30;
    else if (roas > 2) score += 20;
    else if (roas > 1) score += 10;
    
    // Conversions score (0-20 points)
    if (conversions > 50) score += 20;
    else if (conversions > 20) score += 15;
    else if (conversions > 10) score += 10;
    else if (conversions > 0) score += 5;
    
    return Math.min(score, 100);
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizationSuggestions(metrics: any): string[] {
    const suggestions: string[] = [];
    const ctr = parseFloat(metrics.ctr || '0');
    const roas = parseFloat(metrics.roas || '0');
    const cpc = parseFloat(metrics.cpc || '0');
    
    if (ctr < 1) {
      suggestions.push('Improve ad creative to increase click-through rate');
    }
    
    if (roas < 2) {
      suggestions.push('Optimize targeting to improve return on ad spend');
    }
    
    if (cpc > 2) {
      suggestions.push('Refine keywords and targeting to reduce cost per click');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Ad is performing well - consider scaling budget');
    }
    
    return suggestions;
  }

  /**
   * Refresh access token for Google Ads
   */
  async refreshGoogleToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Token refresh failed: ${data.error}`);
      }

      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
}

export const realAdsIntegrationService = new RealAdsIntegrationService();