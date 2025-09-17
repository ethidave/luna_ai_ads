import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { realAdsIntegrationService } from '@/lib/services/realAdsIntegration';
import { AppDataSource } from '@/lib/database';
import { ConnectedAccount, PlatformType, AccountStatus } from '@/lib/entities/ConnectedAccount';

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // For testing purposes, allow requests without authentication
    // In production, you should uncomment the authentication check below
    /*
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */
    
    // Use a default user ID for testing
    const userId = 1;

    const { platform, accessToken, refreshToken } = await request.json();

    if (!platform || !accessToken) {
      return NextResponse.json({ 
        error: 'Platform and access token are required' 
      }, { status: 400 });
    }

    if (!['facebook', 'google'].includes(platform)) {
      return NextResponse.json({ 
        error: 'Invalid platform. Must be facebook or google' 
      }, { status: 400 });
    }

    let accountData;
    
    if (platform === 'facebook') {
      accountData = await realAdsIntegrationService.connectFacebookAccount(accessToken);
    } else if (platform === 'google') {
      if (!refreshToken) {
        return NextResponse.json({ 
          error: 'Refresh token is required for Google Ads' 
        }, { status: 400 });
      }
      accountData = await realAdsIntegrationService.connectGoogleAccount(accessToken, refreshToken);
    }

    // Save to database
    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);
    
    // Check if account already exists
    const existingAccount = await connectedAccountRepo.findOne({
      where: {
        userId: userId,
        platform: platform as PlatformType,
        accountId: accountData.id || accountData.customerId
      }
    });

    if (existingAccount) {
      // Update existing account
      existingAccount.accessToken = accountData.access_token;
      existingAccount.refreshToken = accountData.refresh_token || null;
      existingAccount.status = AccountStatus.ACTIVE;
      existingAccount.lastSyncAt = new Date();
      existingAccount.errorMessage = null;
      
      await connectedAccountRepo.save(existingAccount);
    } else {
      // Create new account
      const connectedAccount = connectedAccountRepo.create({
        userId: userId,
        platform: platform as PlatformType,
        accountId: accountData.id || accountData.customerId,
        accountName: accountData.name,
        currency: accountData.currency,
        timezone: accountData.timezone,
        accessToken: accountData.access_token,
        refreshToken: accountData.refresh_token || null,
        status: AccountStatus.ACTIVE,
        permissions: accountData.permissions || [],
        lastSyncAt: new Date()
      });

      await connectedAccountRepo.save(connectedAccount);
    }

    return NextResponse.json({
      success: true,
      message: `${platform} account connected successfully`,
      account: {
        id: accountData.id || accountData.customerId,
        name: accountData.name,
        platform,
        currency: accountData.currency
      }
    });

  } catch (error) {
    console.error('Account connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect account' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // For testing purposes, allow requests without authentication
    // In production, you should uncomment the authentication check below
    /*
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */
    
    // Use a default user ID for testing
    const userId = 1;

    const connectedAccountRepo = AppDataSource.getRepository(ConnectedAccount);
    const accounts = await connectedAccountRepo.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' }
    });

    return NextResponse.json({
      success: true,
      accounts: accounts.map(account => ({
        id: account.id,
        platform: account.platform,
        accountId: account.accountId,
        accountName: account.accountName,
        currency: account.currency,
        status: account.status,
        lastSyncAt: account.lastSyncAt,
        createdAt: account.createdAt
      }))
    });

  } catch (error) {
    console.error('Failed to fetch connected accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
