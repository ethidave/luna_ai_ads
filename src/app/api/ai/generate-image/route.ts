import { NextRequest, NextResponse } from 'next/server';
import { geminiAI } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      style, 
      dimensions, 
      brandColors 
    } = await request.json();

    // Validate required fields
    if (!prompt || !style || !dimensions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate image using AI
    const imageResult = await geminiAI.generateAdImage({
      prompt,
      style: style as any,
      dimensions: dimensions as any,
      brandColors
    });

    return NextResponse.json({
      success: true,
      image: imageResult,
      message: 'Image generated successfully'
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}





