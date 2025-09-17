import { NextRequest, NextResponse } from "next/server";
import { geminiAI, PackageRecommendationRequest } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      budget,
      objective,
      targetAudience,
      industry,
      experience
    } = body;

    // Validate required fields
    if (!budget || !objective || !targetAudience || !industry) {
      return NextResponse.json({
        error: "Missing required fields: budget, objective, targetAudience, and industry are required"
      }, { status: 400 });
    }

    const packageRequest: PackageRecommendationRequest = {
      budget: parseFloat(budget),
      objective,
      targetAudience,
      industry,
      experience: experience || 'beginner'
    };

    const result = await geminiAI.generatePackageRecommendation(packageRequest);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Package recommendations generated successfully"
    });

  } catch (error) {
    console.error("Package recommendation error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate package recommendations"
    }, { status: 500 });
  }
}
