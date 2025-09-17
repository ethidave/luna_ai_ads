import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Subscription } from "@/lib/entities/Subscription";
import { Package } from "@/lib/entities/Package";

export interface PackageAccessCheck {
  hasAccess: boolean;
  package?: any;
  subscription?: any;
  message?: string;
}

export async function checkPackageAccess(
  request: NextRequest,
  requiredFeature: string
): Promise<PackageAccessCheck> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return {
        hasAccess: false,
        message: "Authentication required"
      };
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const packageRepository = AppDataSource.getRepository(Package);

    // Get user's active subscription
    const activeSubscription = await subscriptionRepository.findOne({
      where: {
        userId: parseInt(session.user.id),
        status: 'active'
      },
      relations: ['package']
    });

    if (!activeSubscription) {
      return {
        hasAccess: false,
        message: "No active subscription found. Please purchase a package to access this feature."
      };
    }

    // Check if subscription is expired
    const now = new Date();
    if (activeSubscription.endDate && activeSubscription.endDate < now) {
      return {
        hasAccess: false,
        message: "Your subscription has expired. Please renew to continue using this feature."
      };
    }

    // Get package details
    const packageDetails = await packageRepository.findOne({
      where: { id: activeSubscription.planId }
    });

    if (!packageDetails) {
      return {
        hasAccess: false,
        message: "Package not found. Please contact support."
      };
    }

    // Check feature access based on package
    const features = JSON.parse((packageDetails.features as string) || '[]');
    
    if (!features.includes(requiredFeature) && !features.includes('all')) {
      return {
        hasAccess: false,
        package: packageDetails,
        subscription: activeSubscription,
        message: `This feature requires a higher package. Upgrade to access ${requiredFeature}.`
      };
    }

    return {
      hasAccess: true,
      package: packageDetails,
      subscription: activeSubscription
    };

  } catch (error) {
    console.error("Error checking package access:", error);
    return {
      hasAccess: false,
      message: "Error checking package access"
    };
  }
}

export function createAccessDeniedResponse(message: string, packageInfo?: any) {
  return NextResponse.json({
    error: "Access denied",
    message,
    package: packageInfo,
    upgradeRequired: true
  }, { status: 403 });
}
