import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeminiService } from "@/lib/services/geminiService";
import { SocialMediaDataSource } from "@/lib/socialMediaDatabase";
import { SocialMediaAccount } from "@/lib/entities/SocialMediaAccount";
import { SocialMediaPost } from "@/lib/entities/SocialMediaPost";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountId, platform } = await request.json();

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    // Get account data
    const accountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);
    const account = await accountRepo.findOne({
      where: { id: accountId, userId: session.user.id }
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get recent posts
    const postRepo = SocialMediaDataSource.getRepository(SocialMediaPost);
    const posts = await postRepo.find({
      where: { socialMediaAccountId: accountId },
      order: { createdAt: "DESC" },
      take: 20
    });

    // Use Gemini AI for engagement analysis
    const geminiService = new GeminiService();
    const analysis = await geminiService.analyzeEngagement(account, posts);

    return NextResponse.json({
      success: true,
      analysis: {
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        trends: analysis.trends,
        audienceAnalysis: analysis.audienceAnalysis,
        accountStats: {
          followers: account.followersCount,
          posts: account.postsCount,
          platform: account.platform
        },
        recentPostsCount: posts.length
      }
    });

  } catch (error) {
    console.error("Error analyzing engagement:", error);
    return NextResponse.json(
      { error: "Failed to analyze engagement" },
      { status: 500 }
    );
  }
}
