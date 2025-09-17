import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Plan, PlanType, BillingCycle } from "@/lib/entities/Plan";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const planRepository = AppDataSource.getRepository(Plan);

    // Clear existing plans
    await planRepository.clear();

    // Create plans with proper UUIDs
    const plans = [
      {
        type: PlanType.STARTER,
        name: 'Starter',
        description: 'For small businesses & startups looking for simple, AI-driven ad automation.',
        price: 29.9,
        billingCycle: BillingCycle.WEEKLY,
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
        limitations: [
          'Up to 2 Ad Accounts',
          'Daily Budget Cap: $500'
        ],
        isActive: true,
        isPopular: false,
        maxFacebookAccounts: 2,
        dailyBudgetCap: 500,
        hasUnlimitedBudget: false,
        hasTeamCollaboration: false,
        hasDedicatedConsultant: false
      },
      {
        type: PlanType.PROFESSIONAL,
        name: 'Professional',
        description: 'For growing businesses that need advanced AI optimization and multi-platform management.',
        price: 79.9,
        billingCycle: BillingCycle.WEEKLY,
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
        limitations: [
          'Up to 5 Ad Accounts',
          'Daily Budget Cap: $2,000'
        ],
        isActive: true,
        isPopular: true,
        maxFacebookAccounts: 5,
        dailyBudgetCap: 2000,
        hasUnlimitedBudget: false,
        hasTeamCollaboration: true,
        hasDedicatedConsultant: false
      },
      {
        type: PlanType.ENTERPRISE,
        name: 'Enterprise',
        description: 'For large businesses and agencies that need unlimited access and dedicated support.',
        price: 199.9,
        billingCycle: BillingCycle.WEEKLY,
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

    // Save plans to database
    const savedPlans = [];
    for (const planData of plans) {
      const plan = planRepository.create(planData);
      const savedPlan = await planRepository.save(plan);
      savedPlans.push(savedPlan);
    }

    return NextResponse.json({
      success: true,
      message: "Plans seeded successfully",
      plans: savedPlans.map(plan => ({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: plan.price
      }))
    });

  } catch (error) {
    console.error("Error seeding plans:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}