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

    const { topic, platform, count = 5 } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Use Gemini AI for content idea generation
    const geminiService = new GeminiService();
    const ideas = await geminiService.generateContentIdeas(topic, platform || "general", count);

    return NextResponse.json({
      success: true,
      ideas,
      count: ideas.length,
      topic,
      platform: platform || "general"
    });

  } catch (error) {
    console.error("Error generating content ideas:", error);
    return NextResponse.json(
      { error: "Failed to generate content ideas" },
      { status: 500 }
    );
  }
}

