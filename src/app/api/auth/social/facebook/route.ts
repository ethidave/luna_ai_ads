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
    const authUrl = socialMediaService.getFacebookAuthUrl();
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating Facebook auth URL:", error);
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
    const tokenData = await socialMediaService.exchangeFacebookCode(code);
    
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error.message }, { status: 400 });
    }

    // Get user info
    const userInfo = await socialMediaService.getFacebookUserInfo(tokenData.access_token);
    
    // Get pages
    const pagesData = await socialMediaService.getFacebookPages(tokenData.access_token);
    
    // Get Instagram accounts
    const instagramData = await socialMediaService.getFacebookInstagramAccounts(tokenData.access_token);

    const socialAccountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);

    // Check if account already exists
    let existingAccount = await socialAccountRepo.findOne({
      where: {
        platform: SocialPlatform.FACEBOOK,
        platformAccountId: userInfo.id,
        userId: session.user.id
      }
    });

    const accountData = {
      platform: SocialPlatform.FACEBOOK,
      platformAccountId: userInfo.id,
      username: userInfo.name,
      displayName: userInfo.name,
      profilePicture: userInfo.picture?.data?.url,
      email: userInfo.email,
      accessToken: tokenData.access_token,
      platformData: {
        ...userInfo,
        pages: pagesData.data || [],
        instagramAccounts: instagramData.data || []
      },
      isConnected: true,
      status: AccountStatus.ACTIVE,
      permissions: [
        "email",
        "public_profile",
        "pages_manage_posts",
        "pages_read_engagement",
        "ads_management",
        "ads_read",
        "instagram_basic",
        "instagram_content_publish"
      ],
      canPostAds: true,
      canAccessAnalytics: true,
      canManagePages: true,
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

    // Create separate accounts for each page
    const pageAccounts = [];
    for (const page of pagesData.data || []) {
      let pageAccount = await socialAccountRepo.findOne({
        where: {
          platform: SocialPlatform.FACEBOOK,
          platformAccountId: page.id,
          userId: session.user.id
        }
      });

      if (!pageAccount) {
        const pageAccountData = {
          platform: SocialPlatform.FACEBOOK,
          platformAccountId: page.id,
          username: page.name,
          displayName: page.name,
          profilePicture: page.picture?.data?.url,
          accessToken: page.access_token,
          platformData: {
            ...page,
            parentAccountId: userInfo.id
          },
          isConnected: true,
          status: AccountStatus.ACTIVE,
          permissions: [
            "pages_manage_posts",
            "pages_read_engagement",
            "ads_management",
            "ads_read"
          ],
          canPostAds: true,
          canAccessAnalytics: true,
          canManagePages: true,
          followersCount: page.fan_count || 0,
          userId: session.user.id
        };

        pageAccount = socialAccountRepo.create(pageAccountData);
        await socialAccountRepo.save(pageAccount);
      }

      pageAccounts.push({
        id: pageAccount.id,
        platform: SocialPlatform.FACEBOOK,
        username: page.name,
        displayName: page.name,
        profilePicture: page.picture?.data?.url,
        isConnected: true,
        type: "page"
      });
    }

    // Create separate accounts for Instagram business accounts
    const instagramAccounts = [];
    for (const page of pagesData.data || []) {
      if (page.instagram_business_account) {
        const instagramAccount = page.instagram_business_account;
        
        let instagramAccountEntity = await socialAccountRepo.findOne({
          where: {
            platform: SocialPlatform.INSTAGRAM,
            platformAccountId: instagramAccount.id,
            userId: session.user.id
          }
        });

        if (!instagramAccountEntity) {
          const instagramAccountData = {
            platform: SocialPlatform.INSTAGRAM,
            platformAccountId: instagramAccount.id,
            username: instagramAccount.username,
            displayName: instagramAccount.name,
            profilePicture: instagramAccount.profile_picture_url,
            accessToken: page.access_token,
            platformData: {
              ...instagramAccount,
              parentPageId: page.id,
              parentAccountId: userInfo.id
            },
            isConnected: true,
            status: AccountStatus.ACTIVE,
            permissions: [
              "instagram_basic",
              "instagram_content_publish",
              "instagram_manage_insights"
            ],
            canPostAds: true,
            canAccessAnalytics: true,
            canManagePages: false,
            followersCount: instagramAccount.followers_count || 0,
            postsCount: instagramAccount.media_count || 0,
            userId: session.user.id
          };

          instagramAccountEntity = socialAccountRepo.create(instagramAccountData);
          await socialAccountRepo.save(instagramAccountEntity);
        }

        instagramAccounts.push({
          id: instagramAccountEntity.id,
          platform: SocialPlatform.INSTAGRAM,
          username: instagramAccount.username,
          displayName: instagramAccount.name,
          profilePicture: instagramAccount.profile_picture_url,
          isConnected: true,
          type: "instagram"
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Facebook account connected successfully",
      accounts: [
        {
          id: existingAccount?.id || "new",
          platform: SocialPlatform.FACEBOOK,
          username: userInfo.name,
          displayName: userInfo.name,
          profilePicture: userInfo.picture?.data?.url,
          isConnected: true,
          type: "personal"
        },
        ...pageAccounts,
        ...instagramAccounts
      ]
    });

  } catch (error) {
    console.error("Error connecting Facebook account:", error);
    return NextResponse.json(
      { error: "Failed to connect Facebook account" },
      { status: 500 }
    );
  }
}
