import { SocialMediaAccount, SocialPlatform, AccountStatus } from "../entities/SocialMediaAccount";
import { SocialMediaPost, PostType, PostStatus } from "../entities/SocialMediaPost";
import { SocialMediaAnalytics, AnalyticsType, MetricType } from "../entities/SocialMediaAnalytics";

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface SocialMediaCredentials {
  google: OAuthConfig;
  facebook: OAuthConfig;
}

export class SocialMediaService {
  private credentials: SocialMediaCredentials;

  constructor() {
    this.credentials = {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/youtube",
          "https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube.readonly",
          "https://www.googleapis.com/auth/adsense.readonly",
          "https://www.googleapis.com/auth/analytics.readonly"
        ]
      },
      facebook: {
        clientId: process.env.FACEBOOK_APP_ID || "",
        clientSecret: process.env.FACEBOOK_APP_SECRET || "",
        redirectUri: process.env.FACEBOOK_REDIRECT_URI || "",
        scope: [
          "email",
          "public_profile",
          "pages_manage_posts",
          "pages_read_engagement",
          "pages_show_list",
          "ads_management",
          "ads_read",
          "business_management",
          "instagram_basic",
          "instagram_content_publish"
        ]
      }
    };
  }

  // Google OAuth Methods
  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.credentials.google.clientId,
      redirect_uri: this.credentials.google.redirectUri,
      scope: this.credentials.google.scope.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent"
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeGoogleCode(code: string): Promise<any> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.credentials.google.clientId,
        client_secret: this.credentials.google.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.credentials.google.redirectUri,
      }),
    });

    return await response.json();
  }

  async getGoogleUserInfo(accessToken: string): Promise<any> {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  }

  async refreshGoogleToken(refreshToken: string): Promise<any> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.credentials.google.clientId,
        client_secret: this.credentials.google.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    return await response.json();
  }

  // Facebook OAuth Methods
  getFacebookAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.credentials.facebook.clientId,
      redirect_uri: this.credentials.facebook.redirectUri,
      scope: this.credentials.facebook.scope.join(","),
      response_type: "code",
      state: "facebook_oauth_state"
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async exchangeFacebookCode(code: string): Promise<any> {
    const response = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.credentials.facebook.clientId,
        client_secret: this.credentials.facebook.clientSecret,
        code,
        redirect_uri: this.credentials.facebook.redirectUri,
      }),
    });

    return await response.json();
  }

  async getFacebookUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`);
    return await response.json();
  }

  async getFacebookPages(accessToken: string): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
    return await response.json();
  }

  async getFacebookInstagramAccounts(accessToken: string): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`);
    return await response.json();
  }

  // Post Publishing Methods
  async publishToGoogle(post: SocialMediaPost, accessToken: string): Promise<any> {
    // YouTube API for video posts
    if (post.type === PostType.VIDEO) {
      return await this.publishToYouTube(post, accessToken);
    }
    
    // For other Google platforms, implement accordingly
    throw new Error("Google platform posting not implemented yet");
  }

  async publishToYouTube(post: SocialMediaPost, accessToken: string): Promise<any> {
    const response = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          title: post.content,
          description: post.content,
          tags: post.hashtags || [],
        },
        status: {
          privacyStatus: post.visibility === "public" ? "public" : "private",
        },
      }),
    });

    return await response.json();
  }

  async publishToFacebook(post: SocialMediaPost, accessToken: string, pageId?: string): Promise<any> {
    const targetId = pageId || "me";
    const response = await fetch(`https://graph.facebook.com/v18.0/${targetId}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: post.content,
        access_token: accessToken,
        ...(post.mediaUrls && post.mediaUrls.length > 0 && {
          link: post.mediaUrls[0]
        })
      }),
    });

    return await response.json();
  }

  async publishToInstagram(post: SocialMediaPost, accessToken: string, instagramAccountId: string): Promise<any> {
    // Instagram requires a two-step process for media posts
    if (post.type === PostType.IMAGE) {
      return await this.publishImageToInstagram(post, accessToken, instagramAccountId);
    } else if (post.type === PostType.VIDEO) {
      return await this.publishVideoToInstagram(post, accessToken, instagramAccountId);
    }
    
    throw new Error("Instagram post type not supported");
  }

  async publishImageToInstagram(post: SocialMediaPost, accessToken: string, instagramAccountId: string): Promise<any> {
    // Step 1: Create media container
    const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: post.mediaUrls?.[0],
        caption: post.content,
        access_token: accessToken,
      }),
    });

    const container = await containerResponse.json();

    // Step 2: Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: accessToken,
      }),
    });

    return await publishResponse.json();
  }

  async publishVideoToInstagram(post: SocialMediaPost, accessToken: string, instagramAccountId: string): Promise<any> {
    // Step 1: Create media container
    const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "VIDEO",
        video_url: post.mediaUrls?.[0],
        caption: post.content,
        access_token: accessToken,
      }),
    });

    const container = await containerResponse.json();

    // Step 2: Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: accessToken,
      }),
    });

    return await publishResponse.json();
  }

  // Analytics Methods
  async getGoogleAnalytics(accountId: string, accessToken: string, dateRange: { start: Date; end: Date }): Promise<any> {
    // Implement Google Analytics API calls
    const response = await fetch(`https://www.googleapis.com/analytics/v3/data/ga?ids=ga:${accountId}&start-date=${dateRange.start.toISOString().split('T')[0]}&end-date=${dateRange.end.toISOString().split('T')[0]}&metrics=ga:sessions,ga:users,ga:pageviews&access_token=${accessToken}`);
    return await response.json();
  }

  async getFacebookAnalytics(accountId: string, accessToken: string, dateRange: { start: Date; end: Date }): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/insights?metric=page_impressions,page_engaged_users,page_post_engagements&since=${Math.floor(dateRange.start.getTime() / 1000)}&until=${Math.floor(dateRange.end.getTime() / 1000)}&access_token=${accessToken}`);
    return await response.json();
  }

  async getInstagramAnalytics(accountId: string, accessToken: string, dateRange: { start: Date; end: Date }): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/insights?metric=impressions,reach,engagement&since=${Math.floor(dateRange.start.getTime() / 1000)}&until=${Math.floor(dateRange.end.getTime() / 1000)}&access_token=${accessToken}`);
    return await response.json();
  }

  // AI Optimization Methods
  async optimizePostContent(content: string, platform: SocialPlatform): Promise<any> {
    try {
      const response = await fetch("/api/ai/optimize-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          platform,
          optimizationType: "engagement"
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error("Failed to optimize content");
    } catch (error) {
      console.error("Error optimizing content:", error);
      return {
        optimizedContent: content,
        engagementScore: 50,
        reachScore: 50,
        conversionScore: 50,
        improvements: ["AI optimization temporarily unavailable"]
      };
    }
  }

  async generateHashtags(content: string, platform: SocialPlatform): Promise<string[]> {
    try {
      const response = await fetch("/api/ai/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          platform
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.hashtags || [];
      }
      throw new Error("Failed to generate hashtags");
    } catch (error) {
      console.error("Error generating hashtags:", error);
      return ["#content", "#socialmedia", "#marketing"];
    }
  }

  async predictOptimalPostTime(accountId: string, platform: SocialPlatform): Promise<Date> {
    try {
      const response = await fetch("/api/ai/optimal-post-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          platform
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Parse the first optimal time
        const timeString = data.optimalTimes?.[0] || "18:00";
        const [hours, minutes] = timeString.split(":").map(Number);
        const optimalTime = new Date();
        optimalTime.setHours(hours, minutes || 0, 0, 0);
        return optimalTime;
      }
      throw new Error("Failed to predict optimal time");
    } catch (error) {
      console.error("Error predicting optimal post time:", error);
      // Return a default time (6 PM)
      const defaultTime = new Date();
      defaultTime.setHours(18, 0, 0, 0);
      return defaultTime;
    }
  }

  async analyzeEngagement(accountId: string, platform: SocialPlatform): Promise<any> {
    try {
      const response = await fetch("/api/ai/analyze-engagement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          platform
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error("Failed to analyze engagement");
    } catch (error) {
      console.error("Error analyzing engagement:", error);
      return {
        insights: ["Analysis temporarily unavailable"],
        recommendations: ["Keep posting consistently"],
        trends: ["Monitor your metrics"]
      };
    }
  }
}
