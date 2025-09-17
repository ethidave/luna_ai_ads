import { NextRequest, NextResponse } from "next/server";
import { geminiAI } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json();

    if (!campaignData) {
      return NextResponse.json({
        error: "Campaign data is required"
      }, { status: 400 });
    }

    const predictions = await geminiAI.generatePerformancePredictions(campaignData);

    return NextResponse.json({
      success: true,
      data: predictions,
      message: "Performance predictions generated successfully"
    });

  } catch (error) {
    console.error("Performance prediction error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate performance predictions"
    }, { status: 500 });
  }
}
