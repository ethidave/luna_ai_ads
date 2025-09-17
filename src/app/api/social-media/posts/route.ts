import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SocialMediaDataSource } from "@/lib/socialMediaDatabase";
import { SocialMediaPost, PostType, PostStatus, PostVisibility } from "@/lib/entities/SocialMediaPost";
import { SocialMediaAccount } from "@/lib/entities/SocialMediaAccount";
import { SocialMediaService } from "@/lib/services/socialMediaService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    const postRepo = SocialMediaDataSource.getRepository(SocialMediaPost);
    
    const where: any = { userId: session.user.id };
    if (platform) where.platform = platform;
    if (status) where.status = status;

    const [posts, total] = await postRepo.findAndCount({
      where,
      relations: ["socialMediaAccount"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        id: post.id,
        platform: post.platform,
        platformPostId: post.platformPostId,
        content: post.content,
        type: post.type,
        status: post.status,
        visibility: post.visibility,
        mediaUrls: post.mediaUrls,
        hashtags: post.hashtags,
        mentions: post.mentions,
        location: post.location,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        isAd: post.isAd,
        adBudget: post.adBudget,
        adObjective: post.adObjective,
        adTargeting: post.adTargeting,
        adCreative: post.adCreative,
        aiOptimization: post.aiOptimization,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        views: post.views,
        clicks: post.clicks,
        spend: post.spend,
        revenue: post.revenue,
        socialMediaAccount: {
          id: post.socialMediaAccount?.id,
          username: post.socialMediaAccount?.username,
          displayName: post.socialMediaAccount?.displayName,
          platform: post.socialMediaAccount?.platform
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      platform,
      content,
      type = PostType.TEXT,
      visibility = PostVisibility.PUBLIC,
      mediaUrls = [],
      hashtags = [],
      mentions = [],
      location,
      scheduledAt,
      isAd = false,
      adBudget,
      adObjective,
      adTargeting,
      adCreative,
      socialMediaAccountId
    } = body;

    if (!platform || !content) {
      return NextResponse.json({ error: "Platform and content are required" }, { status: 400 });
    }

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    const postRepo = SocialMediaDataSource.getRepository(SocialMediaPost);
    const accountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);

    // Verify account exists and user has access
    const account = await accountRepo.findOne({
      where: {
        id: socialMediaAccountId,
        userId: session.user.id,
        platform: platform
      }
    });

    if (!account) {
      return NextResponse.json({ error: "Social media account not found" }, { status: 404 });
    }

    // AI Optimization
    const socialMediaService = new SocialMediaService();
    let aiOptimization = null;
    
    try {
      const optimizedContent = await socialMediaService.optimizePostContent(content, platform as any);
      const suggestedHashtags = await socialMediaService.generateHashtags(content, platform as any);
      const optimalTime = await socialMediaService.predictOptimalPostTime(account.id, platform as any);
      
      aiOptimization = {
        suggestedContent: optimizedContent.content,
        suggestedHashtags: suggestedHashtags,
        suggestedTime: optimalTime,
        engagementScore: optimizedContent.engagementScore || 0,
        reachScore: optimizedContent.reachScore || 0,
        conversionScore: optimizedContent.conversionScore || 0
      };
    } catch (error) {
      console.log("AI optimization failed, proceeding without optimization:", error);
    }

    const postData = {
      platform,
      content,
      type,
      visibility,
      mediaUrls,
      hashtags: aiOptimization?.suggestedHashtags || hashtags,
      mentions,
      location,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      isAd,
      adBudget,
      adObjective,
      adTargeting,
      adCreative,
      aiOptimization,
      status: scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      userId: session.user.id,
      socialMediaAccountId
    };

    const newPost = postRepo.create(postData);
    const savedPost = await postRepo.save(newPost);

    // If not scheduled, publish immediately
    if (!scheduledAt) {
      try {
        let publishResult;
        
        if (platform === "google" || platform === "youtube") {
          publishResult = await socialMediaService.publishToGoogle(savedPost, account.accessToken);
        } else if (platform === "facebook") {
          publishResult = await socialMediaService.publishToFacebook(savedPost, account.accessToken);
        } else if (platform === "instagram") {
          publishResult = await socialMediaService.publishToInstagram(savedPost, account.accessToken, account.platformAccountId);
        }

        // Update post with platform response
        savedPost.platformPostId = publishResult.id;
        savedPost.status = PostStatus.PUBLISHED;
        savedPost.publishedAt = new Date();
        await postRepo.save(savedPost);

      } catch (error) {
        console.error("Error publishing post:", error);
        savedPost.status = PostStatus.FAILED;
        savedPost.errorMessage = error instanceof Error ? error.message : "Unknown error";
        await postRepo.save(savedPost);
      }
    }

    return NextResponse.json({
      success: true,
      post: {
        id: savedPost.id,
        platform: savedPost.platform,
        content: savedPost.content,
        type: savedPost.type,
        status: savedPost.status,
        visibility: savedPost.visibility,
        mediaUrls: savedPost.mediaUrls,
        hashtags: savedPost.hashtags,
        mentions: savedPost.mentions,
        location: savedPost.location,
        scheduledAt: savedPost.scheduledAt,
        publishedAt: savedPost.publishedAt,
        isAd: savedPost.isAd,
        adBudget: savedPost.adBudget,
        adObjective: savedPost.adObjective,
        adTargeting: savedPost.adTargeting,
        adCreative: savedPost.adCreative,
        aiOptimization: savedPost.aiOptimization,
        createdAt: savedPost.createdAt,
        updatedAt: savedPost.updatedAt
      }
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
