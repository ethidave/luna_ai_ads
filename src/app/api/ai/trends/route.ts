import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeminiService } from "@/lib/services/geminiService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform, industry } = await request.json();

    if (!platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    // Use Gemini AI for trend analysis
    const geminiService = new GeminiService();
    const trends = await geminiService.analyzeTrends(platform, industry);

    return NextResponse.json({
      success: true,
      trends: {
        trendingTopics: trends.trendingTopics,
        hashtags: trends.hashtags,
        contentTypes: trends.contentTypes,
        predictions: trends.predictions
      },
      platform,
      industry: industry || "general"
    });

  } catch (error) {
    console.error("Error analyzing trends:", error);
    return NextResponse.json(
      { error: "Failed to analyze trends" },
      { status: 500 }
    );
  }
}

