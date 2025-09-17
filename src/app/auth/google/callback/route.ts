import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { realAdsIntegrationService } from '@/lib/services/realAdsIntegration';
import { AppDataSource } from '@/lib/database';
import { ConnectedAccount, PlatformType, AccountStatus } from '@/lib/entities/ConnectedAccount';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=google_auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_code`);
    }

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=not_authenticated`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/google/callback`,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Google token exchange error:', tokenData.error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_exchange_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);

    // Save connected account to database
    const connectedAccount = new ConnectedAccount();
    connectedAccount.userId = session.user.id;
    connectedAccount.platform = PlatformType.GOOGLE;
    connectedAccount.accountId = userData.id;
    connectedAccount.accountName = userData.name || 'Google Account';
    connectedAccount.accessToken = tokenData.access_token;
    connectedAccount.refreshToken = tokenData.refresh_token || null;
    connectedAccount.status = AccountStatus.ACTIVE;
    connectedAccount.lastSyncAt = new Date();
    connectedAccount.metadata = JSON.stringify({
      email: userData.email,
      permissions: tokenData.scope || [],
    });

    await connectedAccountRepo.save(connectedAccount);

    console.log('✅ Google account connected successfully:', userData.name);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=google_connected`);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=callback_failed`);
  }
}
