import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Package } from "@/lib/entities/Package";

// GET /api/packages - Get all available packages
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const packageRepository = AppDataSource.getRepository(Package);
    
    const packages = await packageRepository.find({
      where: { status: 'active' },
      order: { sortOrder: 'ASC', price: 'ASC' }
    });

    // Transform packages to match the expected format for home page and dashboard
    const transformedPackages = packages.map(pkg => {
      const features = Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]');
      const platforms = Array.isArray(pkg.platforms) ? pkg.platforms : JSON.parse(pkg.platforms || '[]');
      const limitations = pkg.limitations || {};
      const customizations = Array.isArray(pkg.customizations) ? pkg.customizations : JSON.parse(pkg.customizations || '[]');
      
      // Calculate monthly and yearly prices based on package type
      let monthlyPrice = pkg.price;
      let yearlyPrice = pkg.price * 12;
      
      if (pkg.type === 'yearly') {
        yearlyPrice = pkg.price;
        monthlyPrice = pkg.price / 12;
      } else if (pkg.type === 'weekly') {
        monthlyPrice = pkg.price * 4.33; // Approximate weeks in a month
        yearlyPrice = pkg.price * 52;
      } else if (pkg.type === 'daily') {
        monthlyPrice = pkg.price * 30;
        yearlyPrice = pkg.price * 365;
      }

      return {
        id: pkg.id.toString(),
        name: pkg.name,
        description: pkg.description || '',
        price: pkg.price,
        monthlyPrice: Math.round(monthlyPrice * 100) / 100,
        yearlyPrice: Math.round(yearlyPrice * 100) / 100,
        type: pkg.type,
        status: pkg.status,
        features: features,
        platforms: platforms,
        duration: pkg.duration,
        budget: parseFloat(pkg.budget.toString()),
        maxCampaigns: pkg.maxCampaigns,
        maxUsers: pkg.maxUsers,
        limitations: limitations,
        customizations: customizations,
        isPopular: pkg.isPopular,
        isCustom: pkg.isCustom,
        sortOrder: pkg.sortOrder,
        createdAt: pkg.createdAt.toISOString(),
        updatedAt: pkg.updatedAt.toISOString(),
        // Legacy fields for compatibility
        popular: pkg.isPopular,
        color: pkg.isPopular ? "from-purple-500 via-pink-500 to-red-500" : 
               pkg.name.toLowerCase().includes("starter") ? "from-blue-500 to-cyan-500" :
               pkg.name.toLowerCase().includes("professional") ? "from-emerald-500 to-teal-500" :
               pkg.name.toLowerCase().includes("enterprise") ? "from-amber-500 to-orange-500" :
               "from-gray-500 to-gray-600",
        maxFacebookAccounts: pkg.maxUsers,
        dailyBudgetCap: pkg.budget,
        hasUnlimitedBudget: pkg.budget === 0,
        hasTeamCollaboration: pkg.maxUsers > 1,
        hasDedicatedConsultant: pkg.isCustom,
        // Convert limitations object to array for display
        limitationsArray: Object.keys(limitations).length > 0 ? 
          Object.entries(limitations).map(([key, value]) => `${key}: ${value}`) : []
      };
    });

    return NextResponse.json({ 
      success: true,
      packages: transformedPackages,
      message: `Retrieved ${transformedPackages.length} packages successfully` 
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// POST /api/packages - Create a new package (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check
    const body = await request.json();
    const {
      name,
      description,
      price,
      type,
      features,
      platforms,
      duration,
      budget,
      maxCampaigns,
      maxUsers,
      limitations,
      customizations,
      isPopular,
      isCustom,
      sortOrder
    } = body;

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const packageRepository = AppDataSource.getRepository(Package);
    
    const newPackage = packageRepository.create({
      name,
      description,
      price: parseFloat(price),
      type,
      features: JSON.stringify(features || []),
      platforms: JSON.stringify(platforms || []),
      duration: parseInt(duration) || 30,
      budget: parseFloat(budget) || 1000,
      maxCampaigns: parseInt(maxCampaigns) || 0,
      maxUsers: parseInt(maxUsers) || 0,
      limitations: JSON.stringify(limitations || {}),
      customizations: JSON.stringify(customizations || []),
      isPopular: isPopular || false,
      isCustom: isCustom || false,
      sortOrder: parseInt(sortOrder) || 0
    });

    const savedPackage = await packageRepository.save(newPackage);

    return NextResponse.json({ 
      success: true,
      package: savedPackage,
      message: "Package created successfully" 
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}