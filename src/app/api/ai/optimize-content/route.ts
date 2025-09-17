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

    const { content, platform, optimizationType = "engagement" } = await request.json();

    if (!content || !platform) {
      return NextResponse.json({ error: "Content and platform are required" }, { status: 400 });
    }

    // Use Gemini AI for content optimization
    const geminiService = new GeminiService();
    const optimization = await geminiService.optimizeContent(content, platform);

    return NextResponse.json({
      success: true,
      originalContent: content,
      optimizedContent: optimization.optimizedContent,
      suggestions: [
        "Consider posting during peak hours (6-9 PM)",
        "Use high-quality visuals to increase engagement",
        "Engage with comments within the first hour",
        "Share behind-the-scenes content for authenticity"
      ],
      engagementScore: optimization.engagementScore,
      reachScore: optimization.reachScore,
      conversionScore: optimization.conversionScore,
      improvements: optimization.improvements
    });

  } catch (error) {
    console.error("Error optimizing content:", error);
    return NextResponse.json(
      { error: "Failed to optimize content" },
      { status: 500 }
    );
  }
}

async function optimizeContentWithAI(content: string, platform: string, optimizationType: string) {
  // This is a mock implementation - replace with actual AI service
  const improvements = [];
  let optimizedContent = content;
  let engagementScore = 0;
  let reachScore = 0;
  let conversionScore = 0;

  // Platform-specific optimizations
  if (platform === "instagram") {
    // Add emojis for better engagement
    if (!content.includes("🎯") && !content.includes("✨")) {
      optimizedContent = `✨ ${optimizedContent} 🎯`;
      improvements.push("Added engaging emojis");
    }

    // Ensure hashtags are present
    if (!content.includes("#")) {
      const hashtags = generateHashtags(content);
      optimizedContent += `\n\n${hashtags.join(" ")}`;
      improvements.push("Added relevant hashtags");
    }

    // Optimize for Instagram's algorithm
    if (content.length < 100) {
      optimizedContent += "\n\nWhat do you think? Let me know in the comments! 👇";
      improvements.push("Added call-to-action for engagement");
    }

    engagementScore = 85;
    reachScore = 78;
    conversionScore = 72;
  } else if (platform === "facebook") {
    // Add questions for engagement
    if (!content.includes("?") && !content.includes("What") && !content.includes("How")) {
      optimizedContent += "\n\nWhat's your experience with this? Share your thoughts below!";
      improvements.push("Added engaging question");
    }

    // Optimize for Facebook's algorithm
    if (content.length < 200) {
      optimizedContent = `🔥 ${optimizedContent}\n\nThis is something everyone should know!`;
      improvements.push("Added attention-grabbing elements");
    }

    engagementScore = 82;
    reachScore = 85;
    conversionScore = 68;
  } else if (platform === "youtube" || platform === "google") {
    // Add SEO-friendly elements
    if (!content.includes("Tutorial") && !content.includes("Guide") && !content.includes("How to")) {
      optimizedContent = `Complete Guide: ${optimizedContent}`;
      improvements.push("Added SEO-friendly title elements");
    }

    // Add call-to-action
    if (!content.includes("Subscribe") && !content.includes("Like")) {
      optimizedContent += "\n\n👍 Like this video if it helped you!\n🔔 Subscribe for more content like this!";
      improvements.push("Added call-to-action");
    }

    engagementScore = 88;
    reachScore = 82;
    conversionScore = 75;
  }

  // General optimizations
  if (content.length < 50) {
    optimizedContent += "\n\n#content #socialmedia #marketing";
    improvements.push("Added general hashtags for discoverability");
  }

  // Add emotional triggers
  if (!content.includes("amazing") && !content.includes("incredible") && !content.includes("unbelievable")) {
    optimizedContent = optimizedContent.replace(/good/g, "amazing");
    optimizedContent = optimizedContent.replace(/great/g, "incredible");
    improvements.push("Enhanced emotional language");
  }

  return {
    content: optimizedContent,
    suggestions: [
      "Consider posting during peak hours (6-9 PM)",
      "Use high-quality visuals to increase engagement",
      "Engage with comments within the first hour",
      "Share behind-the-scenes content for authenticity"
    ],
    engagementScore,
    reachScore,
    conversionScore,
    improvements
  };
}

function generateHashtags(content: string): string[] {
  const hashtags = [];
  const words = content.toLowerCase().split(/\s+/);
  
  // Extract key terms
  const keyTerms = words.filter(word => 
    word.length > 3 && 
    !["this", "that", "with", "from", "they", "have", "been", "were", "said", "each", "which", "their", "time", "will", "about", "there", "could", "other", "after", "first", "well", "also", "where", "much", "some", "very", "when", "come", "here", "just", "like", "long", "make", "many", "over", "such", "take", "than", "them", "these", "think", "want", "been", "find", "give", "good", "know", "look", "made", "most", "only", "other", "over", "said", "same", "see", "she", "some", "take", "than", "them", "these", "think", "this", "time", "very", "want", "well", "were", "what", "when", "will", "with", "your"].includes(word)
  );

  // Add relevant hashtags based on content
  keyTerms.slice(0, 5).forEach(term => {
    hashtags.push(`#${term}`);
  });

  // Add platform-specific hashtags
  hashtags.push("#content", "#socialmedia", "#marketing", "#digital", "#growth");

  return hashtags.slice(0, 10); // Limit to 10 hashtags
}
