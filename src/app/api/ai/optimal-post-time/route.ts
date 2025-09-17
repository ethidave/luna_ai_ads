import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeminiService } from "@/lib/services/geminiService";
import { SocialMediaDataSource } from "@/lib/socialMediaDatabase";
import { SocialMediaAccount } from "@/lib/entities/SocialMediaAccount";

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

    // Use Gemini AI for optimal post time prediction
    const geminiService = new GeminiService();
    const prediction = await geminiService.predictOptimalPostTime(account, platform || account.platform);

    return NextResponse.json({
      success: true,
      optimalTimes: prediction.bestTimes,
      reasoning: prediction.reasoning,
      timezone: prediction.timezone,
      accountInfo: {
        platform: account.platform,
        followers: account.followersCount,
        username: account.username
      }
    });

  } catch (error) {
    console.error("Error predicting optimal post time:", error);
    return NextResponse.json(
      { error: "Failed to predict optimal post time" },
      { status: 500 }
    );
  }
}
