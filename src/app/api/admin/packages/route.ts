import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { AppDataSource } from "@/lib/database";
import { Package } from "@/lib/entities/Package";
import { trackPriceChange } from "@/lib/utils/priceHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize database connection
const initializeDB = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(Package);
};

// GET /api/admin/packages - Get all packages
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const packageRepo = await initializeDB();

    // Get all packages with proper ordering
    const packages = await packageRepo.find({
      order: { 
        sortOrder: 'ASC', 
        createdAt: 'DESC' 
      }
    });

    // Transform packages to match expected format
    const transformedPackages = packages.map(pkg => ({
      id: pkg.id.toString(),
      name: pkg.name,
      description: pkg.description || '',
      price: parseFloat(pkg.price.toString()),
      type: pkg.type,
      status: pkg.status,
      features: Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]'),
      platforms: Array.isArray(pkg.platforms) ? pkg.platforms : JSON.parse(pkg.platforms || '[]'),
      duration: pkg.duration,
      budget: parseFloat(pkg.budget.toString()),
      maxCampaigns: pkg.maxCampaigns,
      maxUsers: pkg.maxUsers,
      limitations: pkg.limitations || {},
      customizations: Array.isArray(pkg.customizations) ? pkg.customizations : JSON.parse(pkg.customizations || '[]'),
      isPopular: pkg.isPopular,
      isCustom: pkg.isCustom,
      sortOrder: pkg.sortOrder,
      createdAt: pkg.createdAt.toISOString(),
      updatedAt: pkg.updatedAt.toISOString(),
      // Legacy fields for compatibility
      billingCycle: pkg.type === 'monthly' ? 'monthly' : 'yearly',
      isActive: pkg.status === 'active',
      maxFacebookAccounts: pkg.maxUsers,
      dailyBudgetCap: pkg.budget,
      hasUnlimitedBudget: pkg.budget === 0,
      hasTeamCollaboration: pkg.maxUsers > 1,
      hasDedicatedConsultant: pkg.isCustom
    }));

    return NextResponse.json({
      success: true,
      packages: transformedPackages,
      message: `Retrieved ${transformedPackages.length} packages`
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch packages", 
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/packages - Create a new package
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const packageRepo = await initializeDB();

    const packageData = await request.json();

    // Validate required fields
    if (!packageData.name || !packageData.price) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields",
          message: "Package name and price are required"
        },
        { status: 400 }
      );
    }

    // Create new package
    const newPackage = packageRepo.create({
      name: packageData.name,
      description: packageData.description || '',
      price: parseFloat(packageData.price),
      type: packageData.type || 'monthly',
      status: packageData.status || 'active',
      features: JSON.stringify(packageData.features || []),
      platforms: JSON.stringify(packageData.platforms || ['facebook', 'google']),
      duration: parseInt(packageData.duration) || 30,
      budget: parseFloat(packageData.budget) || 1000,
      maxCampaigns: parseInt(packageData.maxCampaigns) || 0,
      maxUsers: parseInt(packageData.maxUsers) || 1,
      limitations: JSON.stringify(packageData.limitations || {}),
      customizations: JSON.stringify(packageData.customizations || []),
      isPopular: packageData.isPopular || false,
      isCustom: packageData.isCustom || false,
      sortOrder: parseInt(packageData.sortOrder) || 0
    });

    const savedPackage = await packageRepo.save(newPackage);

    return NextResponse.json({
      success: true,
      package: {
        id: savedPackage.id.toString(),
        name: savedPackage.name,
        description: savedPackage.description,
        price: parseFloat(savedPackage.price.toString()),
        type: savedPackage.type,
        status: savedPackage.status,
        features: Array.isArray(savedPackage.features) ? savedPackage.features : JSON.parse(savedPackage.features || '[]'),
        platforms: Array.isArray(savedPackage.platforms) ? savedPackage.platforms : JSON.parse(savedPackage.platforms || '[]'),
        duration: savedPackage.duration,
        budget: parseFloat(savedPackage.budget.toString()),
        maxCampaigns: savedPackage.maxCampaigns,
        maxUsers: savedPackage.maxUsers,
        limitations: savedPackage.limitations || {},
        customizations: Array.isArray(savedPackage.customizations) ? savedPackage.customizations : JSON.parse(savedPackage.customizations || '[]'),
        isPopular: savedPackage.isPopular,
        isCustom: savedPackage.isCustom,
        sortOrder: savedPackage.sortOrder,
        createdAt: savedPackage.createdAt.toISOString(),
        updatedAt: savedPackage.updatedAt.toISOString()
      },
      message: "Package created successfully"
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create package",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/packages - Update a package
export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const packageRepo = await initializeDB();

    const { id, ...packageData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: "Package ID is required",
          message: "Please provide a valid package ID"
        },
        { status: 400 }
      );
    }

    // Find the package
    const existingPackage = await packageRepo.findOne({ where: { id: parseInt(id) } });

    if (!existingPackage) {
      return NextResponse.json(
        { 
          success: false,
          error: "Package not found",
          message: "No package found with the provided ID"
        },
        { status: 404 }
      );
    }

    // Update package fields
    if (packageData.name) existingPackage.name = packageData.name;
    if (packageData.description !== undefined) existingPackage.description = packageData.description;
    if (packageData.price !== undefined) existingPackage.price = parseFloat(packageData.price);
    if (packageData.type) existingPackage.type = packageData.type;
    if (packageData.status) existingPackage.status = packageData.status;
    if (packageData.features) existingPackage.features = JSON.stringify(packageData.features);
    if (packageData.platforms) existingPackage.platforms = JSON.stringify(packageData.platforms);
    if (packageData.duration !== undefined) existingPackage.duration = parseInt(packageData.duration);
    if (packageData.budget !== undefined) existingPackage.budget = parseFloat(packageData.budget);
    if (packageData.maxCampaigns !== undefined) existingPackage.maxCampaigns = parseInt(packageData.maxCampaigns);
    if (packageData.maxUsers !== undefined) existingPackage.maxUsers = parseInt(packageData.maxUsers);
    if (packageData.limitations) existingPackage.limitations = JSON.stringify(packageData.limitations);
    if (packageData.customizations) existingPackage.customizations = JSON.stringify(packageData.customizations);
    if (packageData.isPopular !== undefined) existingPackage.isPopular = packageData.isPopular;
    if (packageData.isCustom !== undefined) existingPackage.isCustom = packageData.isCustom;
    if (packageData.sortOrder !== undefined) existingPackage.sortOrder = parseInt(packageData.sortOrder);

    // Track price change if price was updated
    if (packageData.price !== undefined) {
      const oldPrice = parseFloat(existingPackage.price.toString());
      const newPrice = parseFloat(packageData.price);
      
      if (oldPrice !== newPrice) {
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
          await trackPriceChange({
            packageId: parseInt(id),
            oldPrice: oldPrice,
            newPrice: newPrice,
            changedByUserId: session.user.id,
            reason: packageData.priceChangeReason || "Price updated via admin panel",
            metadata: {
              previousPrice: oldPrice,
              newPrice: newPrice,
              changeType: newPrice > oldPrice ? "increase" : "decrease",
              updatedFields: Object.keys(packageData)
            }
          });
        }
      }
    }

    const updatedPackage = await packageRepo.save(existingPackage);

    return NextResponse.json({
      success: true,
      package: {
        id: updatedPackage.id.toString(),
        name: updatedPackage.name,
        description: updatedPackage.description,
        price: parseFloat(updatedPackage.price.toString()),
        type: updatedPackage.type,
        status: updatedPackage.status,
        features: Array.isArray(updatedPackage.features) ? updatedPackage.features : JSON.parse(updatedPackage.features || '[]'),
        platforms: Array.isArray(updatedPackage.platforms) ? updatedPackage.platforms : JSON.parse(updatedPackage.platforms || '[]'),
        duration: updatedPackage.duration,
        budget: parseFloat(updatedPackage.budget.toString()),
        maxCampaigns: updatedPackage.maxCampaigns,
        maxUsers: updatedPackage.maxUsers,
        limitations: updatedPackage.limitations || {},
        customizations: Array.isArray(updatedPackage.customizations) ? updatedPackage.customizations : JSON.parse(updatedPackage.customizations || '[]'),
        isPopular: updatedPackage.isPopular,
        isCustom: updatedPackage.isCustom,
        sortOrder: updatedPackage.sortOrder,
        createdAt: updatedPackage.createdAt.toISOString(),
        updatedAt: updatedPackage.updatedAt.toISOString()
      },
      message: "Package updated successfully"
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update package",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packages - Delete a package
export async function DELETE(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const packageRepo = await initializeDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: "Package ID is required",
          message: "Please provide a valid package ID"
        },
        { status: 400 }
      );
    }

    // Find the package
    const existingPackage = await packageRepo.findOne({ where: { id: parseInt(id) } });

    if (!existingPackage) {
      return NextResponse.json(
        { 
          success: false,
          error: "Package not found",
          message: "No package found with the provided ID"
        },
        { status: 404 }
      );
    }

    // Delete the package
    await packageRepo.remove(existingPackage);

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete package",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}