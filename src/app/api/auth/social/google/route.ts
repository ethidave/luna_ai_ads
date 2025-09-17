import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SocialMediaDataSource } from "@/lib/socialMediaDatabase";
import { SocialMediaAccount, SocialPlatform, AccountStatus } from "@/lib/entities/SocialMediaAccount";
import { SocialMediaService } from "@/lib/services/socialMediaService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const socialMediaService = new SocialMediaService();
    const authUrl = socialMediaService.getGoogleAuthUrl();
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Authorization code required" }, { status: 400 });
    }

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    const socialMediaService = new SocialMediaService();
    
    // Exchange code for tokens
    const tokenData = await socialMediaService.exchangeGoogleCode(code);
    
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    // Get user info
    const userInfo = await socialMediaService.getGoogleUserInfo(tokenData.access_token);
    
    // Get YouTube channel info
    let youtubeChannel = null;
    try {
      const youtubeResponse = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      const youtubeData = await youtubeResponse.json();
      youtubeChannel = youtubeData.items?.[0];
    } catch (error) {
      console.log("YouTube channel not available or accessible");
    }

    const socialAccountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);

    // Check if account already exists
    let existingAccount = await socialAccountRepo.findOne({
      where: {
        platform: SocialPlatform.GOOGLE,
        platformAccountId: userInfo.id,
        userId: session.user.id
      }
    });

    const accountData = {
      platform: SocialPlatform.GOOGLE,
      platformAccountId: userInfo.id,
      username: userInfo.email,
      displayName: userInfo.name,
      profilePicture: userInfo.picture,
      email: userInfo.email,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
      platformData: {
        ...userInfo,
        youtubeChannel: youtubeChannel
      },
      isConnected: true,
      status: AccountStatus.ACTIVE,
      permissions: [
        "profile",
        "email",
        "youtube",
        "analytics"
      ],
      canPostAds: true,
      canAccessAnalytics: true,
      canManagePages: false,
      followersCount: youtubeChannel?.statistics?.subscriberCount || 0,
      postsCount: youtubeChannel?.statistics?.videoCount || 0,
      userId: session.user.id
    };

    if (existingAccount) {
      // Update existing account
      Object.assign(existingAccount, accountData);
      await socialAccountRepo.save(existingAccount);
    } else {
      // Create new account
      const newAccount = socialAccountRepo.create(accountData);
      await socialAccountRepo.save(newAccount);
    }

    return NextResponse.json({
      success: true,
      message: "Google account connected successfully",
      account: {
        id: existingAccount?.id || "new",
        platform: SocialPlatform.GOOGLE,
        username: userInfo.email,
        displayName: userInfo.name,
        profilePicture: userInfo.picture,
        isConnected: true
      }
    });

  } catch (error) {
    console.error("Error connecting Google account:", error);
    return NextResponse.json(
      { error: "Failed to connect Google account" },
      { status: 500 }
    );
  }
}
