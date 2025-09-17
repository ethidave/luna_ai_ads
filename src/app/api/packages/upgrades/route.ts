import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Plan, PlanType } from "@/lib/entities/Plan";
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
        upgrades: [],
        message: "Admin users don't have packages" 
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const planRepository = AppDataSource.getRepository(Plan);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    // Get user's current subscription
    const currentSubscription = await subscriptionRepository.findOne({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    let currentPlanType = null;
    if (currentSubscription) {
      const currentPlan = await planRepository.findOne({
        where: { id: currentSubscription.planId }
      });
      currentPlanType = currentPlan?.type;
    }

    // Get all available plans
    const allPlans = await planRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' }
    });

    // Filter upgrades based on current plan
    let availableUpgrades = allPlans;
    
    if (currentPlanType) {
      const planHierarchy = {
        [PlanType.STARTER]: 1,
        [PlanType.PROFESSIONAL]: 2,
        [PlanType.ENTERPRISE]: 3
      };
      
      const currentLevel = planHierarchy[currentPlanType] || 0;
      
      availableUpgrades = allPlans.filter(plan => {
        const planLevel = planHierarchy[plan.type] || 0;
        return planLevel > currentLevel; // Only show higher level plans
      });
    }

    // Add upgrade information
    const upgradesWithInfo = availableUpgrades.map(plan => ({
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
      hasDedicatedConsultant: plan.hasDedicatedConsultant,
      upgradeFrom: currentPlanType || 'none'
    }));

    return NextResponse.json({
      success: true,
      currentPlan: currentPlanType,
      availableUpgrades: upgradesWithInfo,
      message: currentPlanType ? 
        `Available upgrades from ${currentPlanType}` : 
        "All packages available"
    });

  } catch (error) {
    console.error("Error fetching upgrades:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
