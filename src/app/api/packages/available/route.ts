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
        packages: [],
        message: "Admin users don't have packages" 
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const planRepository = AppDataSource.getRepository(Plan);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    // Get all plans
    const allPlans = await planRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' }
    });

    // If no plans in database, return mock plans
    if (allPlans.length === 0) {
      console.log("📦 No plans in database, returning mock plans");
      const mockPlans = [
        {
          id: 'starter',
          type: 'starter',
          name: 'Starter',
          description: 'For small businesses & startups looking for simple, AI-driven ad automation.',
          price: 29.9,
          billingCycle: 'monthly',
          originalPrice: 129,
          discountPercentage: 0,
          features: [
            '1-Min Ad Setup',
            'Facebook Ads Management',
            'Google Ads Management',
            '24/7 Ad Campaign Optimization',
            'AI Market Research',
            'AI Budget Optimizer & Performance Forecasts',
            'AI Ad Copy & Image Generation',
            'Expert Ad Targeting Strategy',
            'Top-performing Audiences',
            'Live Data Insights',
            'Customer Support'
          ],
          limitations: ['Up to 2 Ad Accounts', 'Daily Budget Cap: $500'],
          isActive: true,
          isPopular: false,
          maxFacebookAccounts: 2,
          dailyBudgetCap: 500,
          hasUnlimitedBudget: false,
          hasTeamCollaboration: false,
          hasDedicatedConsultant: false
        },
        {
          id: 'professional',
          type: 'professional',
          name: 'Professional',
          description: 'For growing businesses that need advanced AI optimization and multi-platform management.',
          price: 79.9,
          billingCycle: 'monthly',
          originalPrice: 299,
          discountPercentage: 0,
          features: [
            'Everything in Starter',
            'Instagram Ads Management',
            'TikTok Ads Management',
            'Advanced AI Optimization',
            'A/B Testing Automation',
            'Competitor Analysis',
            'Advanced Targeting Options',
            'Custom Audience Creation',
            'Performance Forecasting',
            'Priority Support',
            'Up to 5 Ad Accounts',
            'Daily Budget Cap: $2,000'
          ],
          limitations: ['Up to 5 Ad Accounts', 'Daily Budget Cap: $2,000'],
          isActive: true,
          isPopular: true,
          maxFacebookAccounts: 5,
          dailyBudgetCap: 2000,
          hasUnlimitedBudget: false,
          hasTeamCollaboration: true,
          hasDedicatedConsultant: false
        },
        {
          id: 'enterprise',
          type: 'enterprise',
          name: 'Enterprise',
          description: 'For large businesses and agencies that need unlimited access and dedicated support.',
          price: 199.9,
          billingCycle: 'monthly',
          originalPrice: 599,
          discountPercentage: 0,
          features: [
            'Everything in Professional',
            'Unlimited Ad Accounts',
            'Unlimited Budget',
            'White-label Solutions',
            'API Access',
            'Custom Integrations',
            'Dedicated Account Manager',
            '24/7 Phone Support',
            'Custom Reporting',
            'Team Collaboration Tools',
            'Advanced Analytics',
            'Priority Feature Requests'
          ],
          limitations: [],
          isActive: true,
          isPopular: false,
          maxFacebookAccounts: 999,
          dailyBudgetCap: null,
          hasUnlimitedBudget: true,
          hasTeamCollaboration: true,
          hasDedicatedConsultant: true
        }
      ];

      return NextResponse.json({
        success: true,
        availablePackages: mockPlans,
        allPackages: mockPlans,
        activeSubscriptions: []
      });
    }

    // Get user's active subscriptions
    const activeSubscriptions = await subscriptionRepository.find({
      where: {
        userId: session.user.id,
        status: 'active'
      },
      relations: ['plan']
    });

    // Filter out plans that user already has active subscriptions for
    const availablePlans = allPlans.filter(plan => {
      const hasActiveSubscription = activeSubscriptions.some(sub => 
        sub.planId === plan.id && 
        sub.endDate && 
        new Date(sub.endDate) > new Date()
      );
      return !hasActiveSubscription;
    });

    // Add status information to plans
    const plansWithStatus = allPlans.map(plan => {
      const userSubscription = activeSubscriptions.find(sub => sub.planId === plan.id);
      const isActive = userSubscription && 
        userSubscription.status === 'active' && 
        userSubscription.endDate && 
        new Date(userSubscription.endDate) > new Date();
      
      const isExpired = userSubscription && 
        userSubscription.endDate && 
        new Date(userSubscription.endDate) <= new Date();

      return {
        ...plan,
        userStatus: isActive ? 'active' : isExpired ? 'expired' : 'available',
        subscription: userSubscription || null,
        daysRemaining: userSubscription && userSubscription.endDate ? 
          Math.ceil((new Date(userSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
      };
    });

    return NextResponse.json({
      success: true,
      availablePackages: availablePlans,
      allPackages: plansWithStatus,
      activeSubscriptions: activeSubscriptions.map(sub => ({
        id: sub.id,
        packageId: sub.planId,
        packageName: sub.plan?.name,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        amount: sub.amount,
        paymentMethod: sub.paymentMethod,
        daysRemaining: sub.endDate ? 
          Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
      }))
    });

  } catch (error) {
    console.error("Error fetching available packages:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
