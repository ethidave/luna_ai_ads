import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Plan } from "@/lib/entities/Plan";
import { Subscription } from "@/lib/entities/Subscription";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin users don't have packages/subscriptions
    if (session.user.isAdmin) {
      return NextResponse.json({ 
        currentPackage: null,
        message: "Admin users don't have packages" 
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const planRepository = AppDataSource.getRepository(Plan);

    // Get user's active subscription
    const activeSubscription = await subscriptionRepository.findOne({
      where: {
        userId: session.user.id,
        status: 'active'
      },
      relations: ['plan']
    });

    if (!activeSubscription) {
      return NextResponse.json({
        success: true,
        hasActivePackage: false,
        message: "No active package found"
      });
    }

    // Get plan details
    const plan = await planRepository.findOne({
      where: { id: activeSubscription.planId }
    });

    if (!plan) {
      return NextResponse.json({
        success: true,
        hasActivePackage: false,
        message: "Plan not found"
      });
    }

    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(activeSubscription.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Check if package is expired
    const isExpired = daysRemaining <= 0;

    return NextResponse.json({
      success: true,
      hasActivePackage: !isExpired,
      package: {
        id: plan.id,
        name: plan.name,
        type: plan.type,
        description: plan.description,
        price: plan.price,
        features: plan.features,
        limitations: plan.limitations,
        isPopular: plan.isPopular,
        maxFacebookAccounts: plan.maxFacebookAccounts,
        dailyBudgetCap: plan.dailyBudgetCap,
        hasUnlimitedBudget: plan.hasUnlimitedBudget,
        hasTeamCollaboration: plan.hasTeamCollaboration,
        hasDedicatedConsultant: plan.hasDedicatedConsultant
      },
      subscription: {
        id: activeSubscription.id,
        status: activeSubscription.status,
        startDate: activeSubscription.startDate,
        endDate: activeSubscription.endDate,
        daysRemaining: Math.max(0, daysRemaining),
        isExpired,
        paymentMethod: activeSubscription.paymentMethod,
        amount: activeSubscription.amount
      }
    });

  } catch (error) {
    console.error("Error fetching current package:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
