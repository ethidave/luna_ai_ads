import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  try {
    const result = await signIn('google', {
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        { error: 'Google authentication failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      redirectUrl: callbackUrl
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

