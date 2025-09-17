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
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=facebook_auth_failed`);
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
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        client_secret: process.env.FACEBOOK_APP_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/facebook/callback`,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Facebook token exchange error:', tokenData.error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_exchange_failed`);
    }

    // Get user info and ad accounts from Facebook
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    const adAccountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${tokenData.access_token}&fields=id,name,account_status`);
    const adAccountsData = await adAccountsResponse.json();

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);

    // Save connected account to database
    const connectedAccount = new ConnectedAccount();
    connectedAccount.userId = session.user.id;
    connectedAccount.platform = PlatformType.FACEBOOK;
    connectedAccount.accountId = userData.id;
    connectedAccount.accountName = userData.name || 'Facebook Account';
    connectedAccount.accessToken = tokenData.access_token;
    connectedAccount.refreshToken = tokenData.refresh_token || null;
    connectedAccount.status = AccountStatus.ACTIVE;
    connectedAccount.lastSyncAt = new Date();
    connectedAccount.metadata = JSON.stringify({
      adAccounts: adAccountsData.data || [],
      permissions: tokenData.scopes || [],
    });

    await connectedAccountRepo.save(connectedAccount);

    console.log('✅ Facebook account connected successfully:', userData.name);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=facebook_connected`);

  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=callback_failed`);
  }
}
