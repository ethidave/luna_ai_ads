import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SocialMediaDataSource } from "@/lib/socialMediaDatabase";
import { SocialMediaAccount, SocialPlatform } from "@/lib/entities/SocialMediaAccount";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    const socialAccountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);
    
    const accounts = await socialAccountRepo.find({
      where: { userId: session.user.id },
      order: { createdAt: "DESC" }
    });

    const accountsByPlatform = accounts.reduce((acc, account) => {
      if (!acc[account.platform]) {
        acc[account.platform] = [];
      }
      acc[account.platform].push({
        id: account.id,
        platform: account.platform,
        platformAccountId: account.platformAccountId,
        username: account.username,
        displayName: account.displayName,
        profilePicture: account.profilePicture,
        bio: account.bio,
        email: account.email,
        website: account.website,
        followersCount: account.followersCount,
        followingCount: account.followingCount,
        postsCount: account.postsCount,
        status: account.status,
        isConnected: account.isConnected,
        canPostAds: account.canPostAds,
        canAccessAnalytics: account.canAccessAnalytics,
        canManagePages: account.canManagePages,
        lastSyncAt: account.lastSyncAt,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      accounts: accountsByPlatform,
      totalAccounts: accounts.length
    });

  } catch (error) {
    console.error("Error fetching social media accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 });
    }

    // Initialize database if not already initialized
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
    }

    const socialAccountRepo = SocialMediaDataSource.getRepository(SocialMediaAccount);
    
    const account = await socialAccountRepo.findOne({
      where: {
        id: accountId,
        userId: session.user.id
      }
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    await socialAccountRepo.remove(account);

    return NextResponse.json({
      success: true,
      message: "Account disconnected successfully"
    });

  } catch (error) {
    console.error("Error disconnecting account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
