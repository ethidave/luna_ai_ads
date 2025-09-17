import { NextRequest, NextResponse } from "next/server";
import { geminiAI, AdCopyRequest } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      targetAudience,
      platform,
      objective,
      tone,
      industry,
      budget,
      language,
      region
    } = body;

    // Validate required fields
    if (!productName || !platform || !objective) {
      return NextResponse.json({
        error: "Missing required fields: productName, platform, and objective are required"
      }, { status: 400 });
    }

    const adCopyRequest: AdCopyRequest = {
      productName,
      targetAudience: targetAudience || "General audience",
      platform,
      objective,
      tone: tone || 'professional',
      language: language || 'English',
      region: region || 'Global',
      industry: industry || 'Technology',
      budget: budget || 1000
    };

    const result = await geminiAI.generateAdCopy(adCopyRequest);

    // Extract and format tags specifically
    const tagData = {
      // Basic content
      headline: result.headline,
      description: result.primaryText,
      callToAction: result.callToAction,
      
      // Advanced tags
      keywords: result.keywords || [],
      hashtags: result.hashtags || [],
      emojis: result.emojis || [],
      
      // Additional content
      tagline: result.tagline || `${productName} - ${objective} made simple`,
      valueProposition: result.valueProposition || `Transform your ${objective} with ${productName}`,
      urgency: result.urgency || "Available now!",
      socialProof: result.socialProof || "Join thousands of satisfied customers",
      benefits: result.benefits || [],
      
      // Performance metrics
      performanceScore: result.performanceScore || 75,
      estimatedCTR: result.estimatedCTR || 2.5,
      estimatedCPC: result.estimatedCPC || 1.5,
      
      // Suggestions
      suggestions: result.suggestions || [],
      
      // Platform-specific tags
      platformTags: {
        facebook: ["social", "community", "friends", "share", "like", "follow"],
        instagram: ["visual", "photo", "story", "reels", "aesthetic", "inspo"],
        google: ["search", "find", "discover", "results", "organic", "seo"],
        youtube: ["video", "watch", "subscribe", "channel", "content", "creator"],
        linkedin: ["professional", "career", "business", "network", "industry", "B2B"],
        tiktok: ["viral", "trending", "creative", "fun", "entertainment", "shortform"],
        twitter: ["tweet", "trending", "news", "update", "follow", "retweet"]
      }[platform] || [],
      
      // Industry-specific tags
      industryTags: {
        technology: ["tech", "innovation", "digital", "software", "app", "platform"],
        fashion: ["style", "trendy", "fashion", "clothing", "outfit", "design"],
        health: ["wellness", "fitness", "health", "lifestyle", "nutrition", "wellbeing"],
        finance: ["money", "investment", "finance", "banking", "crypto", "trading"],
        education: ["learning", "education", "course", "training", "skill", "knowledge"],
        food: ["food", "recipe", "cooking", "restaurant", "delicious", "taste"],
        travel: ["travel", "vacation", "trip", "adventure", "explore", "destination"],
        beauty: ["beauty", "skincare", "makeup", "cosmetics", "glow", "beautiful"]
      }[industry?.toLowerCase() || 'technology'] || [],
      
      // Trending tags
      trendingTags: [
        "#trending",
        "#viral", 
        "#popular",
        "#best",
        "#new",
        "#2024",
        "#innovation",
        "#quality",
        "#premium",
        "#exclusive"
      ],
      
      // Generated metadata
      generatedAt: new Date().toISOString(),
      platform: platform,
      objective: objective,
      industry: industry || 'Technology'
    };

    return NextResponse.json({
      success: true,
      data: tagData,
      message: "AI tags and content generated successfully"
    });

  } catch (error) {
    console.error("AI tag generation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate AI tags"
    }, { status: 500 });
  }
}
