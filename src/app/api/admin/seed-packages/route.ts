import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Package, PackageType } from "@/lib/entities/Package";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const packageRepository = AppDataSource.getRepository(Package);

    // Clear existing packages
    await packageRepository.clear();

    // Create default packages
    const defaultPackages = [
      {
        name: "Starter Package",
        description: "Perfect for small businesses and startups getting started with digital advertising",
        price: 99,
        type: PackageType.MONTHLY,
        features: [
          "AI-powered ad copy generation",
          "Basic targeting options",
          "2 platforms (Google Ads, Facebook)",
          "Up to 5 campaigns",
          "Email support",
          "Basic analytics",
          "Global targeting (5 countries)",
          "Performance predictions"
        ],
        platforms: ["google", "facebook"],
        duration: 30,
        budget: 1000,
        maxCampaigns: 5,
        maxUsers: 1,
        limitations: {
          "ai_generations_per_month": 50,
          "global_countries": 5,
          "advanced_analytics": false
        },
        customizations: ["Additional platforms", "Extended support"],
        isPopular: false,
        isCustom: false,
        sortOrder: 1
      },
      {
        name: "Professional Package",
        description: "Ideal for growing businesses and marketing agencies with advanced needs",
        price: 299,
        type: PackageType.YEARLY,
        features: [
          "Advanced AI optimization",
          "Multi-platform targeting",
          "5 platforms (Google, Facebook, Instagram, LinkedIn, YouTube)",
          "Up to 25 campaigns",
          "Priority support",
          "Advanced analytics & reporting",
          "Global targeting (20 countries)",
          "A/B testing tools",
          "Performance predictions",
          "Custom audience creation",
          "Real-time optimization",
          "White-label options"
        ],
        platforms: ["google", "facebook", "instagram", "linkedin", "youtube"],
        duration: 30,
        budget: 5000,
        maxCampaigns: 25,
        maxUsers: 5,
        limitations: {
          "ai_generations_per_month": 200,
          "global_countries": 20,
          "advanced_analytics": true,
          "white_label": true
        },
        customizations: ["Custom integrations", "Dedicated account manager", "API access"],
        isPopular: true,
        isCustom: false,
        sortOrder: 2
      },
      {
        name: "Enterprise Package",
        description: "For large enterprises and agencies requiring maximum scale and customization",
        price: 999,
        type: PackageType.WEEKLY,
        features: [
          "Unlimited AI optimization",
          "All platforms supported",
          "Unlimited campaigns",
          "Dedicated support team",
          "Custom analytics dashboard",
          "Global targeting (unlimited countries)",
          "Advanced A/B testing",
          "Machine learning optimization",
          "Custom integrations",
          "API access",
          "White-label solution",
          "Dedicated account manager",
          "Custom reporting",
          "Priority feature requests",
          "SLA guarantees"
        ],
        platforms: ["google", "facebook", "instagram", "linkedin", "youtube", "tiktok", "twitter"],
        duration: 30,
        budget: 50000,
        maxCampaigns: 999999,
        maxUsers: 999999,
        limitations: {
          "ai_generations_per_month": 999999,
          "global_countries": 999999,
          "advanced_analytics": true,
          "white_label": true,
          "api_access": true,
          "dedicated_support": true
        },
        customizations: ["Fully customizable", "Custom development", "On-premise deployment"],
        isPopular: false,
        isCustom: false,
        sortOrder: 3
      },
      {
        name: "Custom Package",
        description: "Tailored solutions for unique business requirements and specific needs",
        price: 0, // Custom pricing
        type: PackageType.DAILY,
        features: [
          "Fully customized features",
          "Flexible platform selection",
          "Custom campaign limits",
          "Dedicated support",
          "Custom integrations",
          "Flexible pricing",
          "Custom duration",
          "Personalized onboarding",
          "Custom analytics",
          "API access",
          "White-label options"
        ],
        platforms: ["custom"],
        duration: 0, // Custom duration
        budget: 0, // Custom budget
        maxCampaigns: 0, // Custom limits
        maxUsers: 0, // Custom limits
        limitations: {
          "custom_pricing": true,
          "custom_features": true,
          "custom_limits": true
        },
        customizations: ["Everything customizable"],
        isPopular: false,
        isCustom: true,
        sortOrder: 4
      }
    ];

    // Save packages to database
    const savedPackages = [];
    for (const pkgData of defaultPackages) {
      const pkg = packageRepository.create(pkgData);
      const savedPackage = await packageRepository.save(pkg);
      savedPackages.push(savedPackage);
    }

    return NextResponse.json({
      success: true,
      message: "Default packages created successfully",
      packages: savedPackages,
      count: savedPackages.length
    });

  } catch (error) {
    console.error("Error seeding packages:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
