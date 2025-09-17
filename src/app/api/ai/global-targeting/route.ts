import { NextRequest, NextResponse } from "next/server";
import { geminiAI, GlobalTargetingRequest } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      industry,
      budget,
      objective,
      primaryLanguage,
      targetRegions
    } = body;

    // Validate required fields
    if (!productName || !industry || !budget || !objective) {
      return NextResponse.json({
        error: "Missing required fields: productName, industry, budget, and objective are required"
      }, { status: 400 });
    }

    const globalTargetingRequest: GlobalTargetingRequest = {
      productName,
      industry,
      budget: parseFloat(budget),
      objective,
      primaryLanguage: primaryLanguage || 'English',
      targetRegions: targetRegions || []
    };

    const result = await geminiAI.generateGlobalTargeting(globalTargetingRequest);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Global targeting strategy generated successfully"
    });

  } catch (error) {
    console.error("Global targeting generation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate global targeting strategy"
    }, { status: 500 });
  }
}
