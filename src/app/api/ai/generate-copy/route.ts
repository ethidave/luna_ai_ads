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
      maxLength,
      language,
      region,
      industry,
      budget
    } = body;

    // Validate required fields
    if (!productName || !targetAudience || !platform || !objective) {
      return NextResponse.json({
        error: "Missing required fields: productName, targetAudience, platform, and objective are required"
      }, { status: 400 });
    }

    const adCopyRequest: AdCopyRequest = {
      productName,
      targetAudience,
      platform,
      objective,
      tone: tone || 'professional',
      maxLength: maxLength || 100,
      language: language || 'English',
      region: region || 'Global',
      industry: industry || 'General',
      budget: budget || 1000
    };

    const result = await geminiAI.generateAdCopy(adCopyRequest);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Ad copy generated successfully"
    });

  } catch (error) {
    console.error("Ad copy generation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate ad copy"
    }, { status: 500 });
  }
}