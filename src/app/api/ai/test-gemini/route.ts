import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeminiService } from "@/lib/services/geminiService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test Gemini service
    const geminiService = new GeminiService();
    
    // Test hashtag generation
    const hashtags = await geminiService.generateHashtags(
      "AI is revolutionizing social media marketing with automated content creation and optimization",
      "instagram"
    );

    // Test content optimization
    const optimization = await geminiService.optimizeContent(
      "Check out our new product launch",
      "facebook"
    );

    // Test content ideas
    const ideas = await geminiService.generateContentIdeas(
      "artificial intelligence",
      "instagram",
      3
    );

    // Test trends analysis
    const trends = await geminiService.analyzeTrends("instagram", "technology");

    return NextResponse.json({
      success: true,
      message: "Gemini AI integration is working!",
      tests: {
        hashtagGeneration: {
          input: "AI is revolutionizing social media marketing with automated content creation and optimization",
          output: hashtags,
          status: "✅ Working"
        },
        contentOptimization: {
          input: "Check out our new product launch",
          output: optimization,
          status: "✅ Working"
        },
        contentIdeas: {
          input: "artificial intelligence",
          output: ideas,
          status: "✅ Working"
        },
        trendsAnalysis: {
          input: "instagram + technology",
          output: trends,
          status: "✅ Working"
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error testing Gemini integration:", error);
    return NextResponse.json({
      success: false,
      error: "Gemini AI integration failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

