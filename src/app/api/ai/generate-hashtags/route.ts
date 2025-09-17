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

    const { content, platform } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Use Gemini AI for hashtag generation
    const geminiService = new GeminiService();
    const hashtags = await geminiService.generateHashtags(content, platform || "general");

    return NextResponse.json({
      success: true,
      hashtags,
      count: hashtags.length
    });

  } catch (error) {
    console.error("Error generating hashtags:", error);
    return NextResponse.json(
      { error: "Failed to generate hashtags" },
      { status: 500 }
    );
  }
}

async function generateHashtagsWithAI(content: string, platform: string = "general"): Promise<string[]> {
  const hashtags = new Set<string>();
  
  // Extract keywords from content
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Common high-performing hashtags by platform
  const platformHashtags = {
    instagram: [
      "#instagram", "#instagood", "#photooftheday", "#fashion", "#beautiful", "#happy", "#cute", "#tbt", "#like4like", "#followme", "#picoftheday", "#follow", "#me", "#selfie", "#summer", "#art", "#instadaily", "#friends", "#repost", "#nature", "#girl", "#fun", "#style", "#smile", "#food", "#instalike", "#family", "#travel", "#fitness", "#igers", "#nofilter", "#life", "#beauty", "#amazing", "#instamood", "#photography", "#vintage", "#sunset", "#music", "#l4l", "#follow4follow", "#instapic", "#swag", "#instacool", "#instago", "#all_shots", "#instasize", "#bestoftheday", "#instafollow", "#tweegram", "#my", "#lol", "#instahub", "#instagramhub", "#instatag", "#instagood", "#instago", "#instacool", "#instasize", "#all_shots", "#instafollow", "#tweegram", "#my", "#lol", "#instahub", "#instagramhub", "#instatag"
    ],
    facebook: [
      "#facebook", "#socialmedia", "#marketing", "#business", "#entrepreneur", "#success", "#motivation", "#inspiration", "#life", "#love", "#happy", "#fun", "#friends", "#family", "#travel", "#food", "#fitness", "#health", "#beauty", "#fashion", "#art", "#music", "#photography", "#nature", "#technology", "#innovation", "#growth", "#mindset", "#goals", "#dreams", "#happiness", "#gratitude", "#positivity", "#wellness", "#lifestyle", "#trending", "#viral", "#share", "#like", "#comment", "#follow", "#connect", "#community", "#networking", "#brand", "#content", "#digital", "#online", "#web", "#internet", "#social", "#media", "#marketing", "#advertising", "#promotion", "#sales", "#revenue", "#profit", "#money", "#wealth", "#finance", "#investment", "#startup", "#company", "#corporate", "#professional", "#career", "#job", "#work", "#office", "#team", "#leadership", "#management", "#strategy", "#planning", "#execution", "#results", "#performance", "#efficiency", "#productivity", "#quality", "#excellence", "#innovation", "#creativity", "#ideas", "#solutions", "#problems", "#challenges", "#opportunities", "#growth", "#development", "#improvement", "#progress", "#advancement", "#evolution", "#transformation", "#change", "#adaptation", "#flexibility", "#agility", "#speed", "#fast", "#quick", "#rapid", "#immediate", "#instant", "#real", "#time", "#live", "#streaming", "#broadcast", "#video", "#photo", "#image", "#picture", "#visual", "#graphic", "#design", "#creative", "#artistic", "#aesthetic", "#beautiful", "#stunning", "#amazing", "#incredible", "#awesome", "#fantastic", "#wonderful", "#marvelous", "#spectacular", "#outstanding", "#exceptional", "#extraordinary", "#remarkable", "#impressive", "#striking", "#captivating", "#engaging", "#compelling", "#persuasive", "#convincing", "#influential", "#powerful", "#strong", "#effective", "#successful", "#winning", "#victorious", "#triumphant", "#achievement", "#accomplishment", "#milestone", "#breakthrough", "#success", "#victory", "#win", "#triumph", "#achievement", "#accomplishment", "#milestone", "#breakthrough"
    ],
    youtube: [
      "#youtube", "#video", "#content", "#creator", "#youtuber", "#subscribe", "#like", "#comment", "#share", "#viral", "#trending", "#popular", "#famous", "#celebrity", "#influencer", "#socialmedia", "#marketing", "#business", "#entrepreneur", "#success", "#motivation", "#inspiration", "#life", "#love", "#happy", "#fun", "#friends", "#family", "#travel", "#food", "#fitness", "#health", "#beauty", "#fashion", "#art", "#music", "#photography", "#nature", "#technology", "#innovation", "#growth", "#mindset", "#goals", "#dreams", "#happiness", "#gratitude", "#positivity", "#wellness", "#lifestyle", "#trending", "#viral", "#share", "#like", "#comment", "#follow", "#connect", "#community", "#networking", "#brand", "#content", "#digital", "#online", "#web", "#internet", "#social", "#media", "#marketing", "#advertising", "#promotion", "#sales", "#revenue", "#profit", "#money", "#wealth", "#finance", "#investment", "#startup", "#company", "#corporate", "#professional", "#career", "#job", "#work", "#office", "#team", "#leadership", "#management", "#strategy", "#planning", "#execution", "#results", "#performance", "#efficiency", "#productivity", "#quality", "#excellence", "#innovation", "#creativity", "#ideas", "#solutions", "#problems", "#challenges", "#opportunities", "#growth", "#development", "#improvement", "#progress", "#advancement", "#evolution", "#transformation", "#change", "#adaptation", "#flexibility", "#agility", "#speed", "#fast", "#quick", "#rapid", "#immediate", "#instant", "#real", "#time", "#live", "#streaming", "#broadcast", "#video", "#photo", "#image", "#picture", "#visual", "#graphic", "#design", "#creative", "#artistic", "#aesthetic", "#beautiful", "#stunning", "#amazing", "#incredible", "#awesome", "#fantastic", "#wonderful", "#marvelous", "#spectacular", "#outstanding", "#exceptional", "#extraordinary", "#remarkable", "#impressive", "#striking", "#captivating", "#engaging", "#compelling", "#persuasive", "#convincing", "#influential", "#powerful", "#strong", "#effective", "#successful", "#winning", "#victorious", "#triumphant", "#achievement", "#accomplishment", "#milestone", "#breakthrough", "#success", "#victory", "#win", "#triumph", "#achievement", "#accomplishment", "#milestone", "#breakthrough"
    ],
    general: [
      "#content", "#socialmedia", "#marketing", "#business", "#entrepreneur", "#success", "#motivation", "#inspiration", "#life", "#love", "#happy", "#fun", "#friends", "#family", "#travel", "#food", "#fitness", "#health", "#beauty", "#fashion", "#art", "#music", "#photography", "#nature", "#technology", "#innovation", "#growth", "#mindset", "#goals", "#dreams", "#happiness", "#gratitude", "#positivity", "#wellness", "#lifestyle", "#trending", "#viral", "#share", "#like", "#comment", "#follow", "#connect", "#community", "#networking", "#brand", "#content", "#digital", "#online", "#web", "#internet", "#social", "#media", "#marketing", "#advertising", "#promotion", "#sales", "#revenue", "#profit", "#money", "#wealth", "#finance", "#investment", "#startup", "#company", "#corporate", "#professional", "#career", "#job", "#work", "#office", "#team", "#leadership", "#management", "#strategy", "#planning", "#execution", "#results", "#performance", "#efficiency", "#productivity", "#quality", "#excellence", "#innovation", "#creativity", "#ideas", "#solutions", "#problems", "#challenges", "#opportunities", "#growth", "#development", "#improvement", "#progress", "#advancement", "#evolution", "#transformation", "#change", "#adaptation", "#flexibility", "#agility", "#speed", "#fast", "#quick", "#rapid", "#immediate", "#instant", "#real", "#time", "#live", "#streaming", "#broadcast", "#video", "#photo", "#image", "#picture", "#visual", "#graphic", "#design", "#creative", "#artistic", "#aesthetic", "#beautiful", "#stunning", "#amazing", "#incredible", "#awesome", "#fantastic", "#wonderful", "#marvelous", "#spectacular", "#outstanding", "#exceptional", "#extraordinary", "#remarkable", "#impressive", "#striking", "#captivating", "#engaging", "#compelling", "#persuasive", "#convincing", "#influential", "#powerful", "#strong", "#effective", "#successful", "#winning", "#victorious", "#triumphant", "#achievement", "#accomplishment", "#milestone", "#breakthrough", "#success", "#victory", "#win", "#triumph", "#achievement", "#accomplishment", "#milestone", "#breakthrough"
    ]
  };

  // Add platform-specific hashtags
  const platformTags = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.general;
  platformTags.slice(0, 20).forEach(tag => hashtags.add(tag));

  // Add content-based hashtags
  words.forEach(word => {
    if (word.length > 3) {
      hashtags.add(`#${word}`);
    }
  });

  // Add trending hashtags based on content analysis
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes("business") || contentLower.includes("entrepreneur")) {
    hashtags.add("#business");
    hashtags.add("#entrepreneur");
    hashtags.add("#startup");
    hashtags.add("#success");
  }
  
  if (contentLower.includes("marketing") || contentLower.includes("social media")) {
    hashtags.add("#marketing");
    hashtags.add("#socialmedia");
    hashtags.add("#digital");
    hashtags.add("#content");
  }
  
  if (contentLower.includes("fitness") || contentLower.includes("health")) {
    hashtags.add("#fitness");
    hashtags.add("#health");
    hashtags.add("#wellness");
    hashtags.add("#lifestyle");
  }
  
  if (contentLower.includes("travel") || contentLower.includes("adventure")) {
    hashtags.add("#travel");
    hashtags.add("#adventure");
    hashtags.add("#explore");
    hashtags.add("#wanderlust");
  }
  
  if (contentLower.includes("food") || contentLower.includes("recipe")) {
    hashtags.add("#food");
    hashtags.add("#recipe");
    hashtags.add("#cooking");
    hashtags.add("#delicious");
  }
  
  if (contentLower.includes("art") || contentLower.includes("creative")) {
    hashtags.add("#art");
    hashtags.add("#creative");
    hashtags.add("#design");
    hashtags.add("#artist");
  }
  
  if (contentLower.includes("music") || contentLower.includes("song")) {
    hashtags.add("#music");
    hashtags.add("#song");
    hashtags.add("#musician");
    hashtags.add("#audio");
  }
  
  if (contentLower.includes("photo") || contentLower.includes("picture")) {
    hashtags.add("#photography");
    hashtags.add("#photo");
    hashtags.add("#picture");
    hashtags.add("#visual");
  }

  // Convert to array and limit to 30 hashtags
  return Array.from(hashtags).slice(0, 30);
}
