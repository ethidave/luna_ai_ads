import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { UserPackageSelection } from "@/lib/entities/UserPackageSelection";
import { Package } from "@/lib/entities/Package";

// POST /api/user/package-selection - Save user package selection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId, billingCycle, selectedPrice, selectionData } = await request.json();

    if (!packageId || !billingCycle || !selectedPrice) {
      return NextResponse.json({ 
        error: "Missing required fields: packageId, billingCycle, selectedPrice" 
      }, { status: 400 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userPackageSelectionRepo = AppDataSource.getRepository(UserPackageSelection);
    const packageRepo = AppDataSource.getRepository(Package);

    // Verify package exists
    const packageExists = await packageRepo.findOne({ where: { id: packageId } });
    if (!packageExists) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Check if user already has a selection for this package
    const existingSelection = await userPackageSelectionRepo.findOne({
      where: { 
        userId: session.user.id, 
        packageId: packageId,
        isActive: true 
      }
    });

    if (existingSelection) {
      // Update existing selection
      existingSelection.billingCycle = billingCycle;
      existingSelection.selectedPrice = parseFloat(selectedPrice);
      existingSelection.selectionData = selectionData || {};
      existingSelection.updatedAt = new Date();
      
      const updatedSelection = await userPackageSelectionRepo.save(existingSelection);
      
      return NextResponse.json({ 
        success: true, 
        selection: updatedSelection,
        message: "Package selection updated successfully" 
      });
    } else {
      // Create new selection
      const newSelection = userPackageSelectionRepo.create({
        userId: session.user.id,
        packageId: packageId,
        billingCycle: billingCycle,
        selectedPrice: parseFloat(selectedPrice),
        selectionData: selectionData || {},
        isActive: true,
        isCompleted: false
      });

      const savedSelection = await userPackageSelectionRepo.save(newSelection);
      
      return NextResponse.json({ 
        success: true, 
        selection: savedSelection,
        message: "Package selection saved successfully" 
      });
    }
  } catch (error) {
    console.error("Error saving package selection:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET /api/user/package-selection - Get user package selections
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userPackageSelectionRepo = AppDataSource.getRepository(UserPackageSelection);
    const packageRepo = AppDataSource.getRepository(Package);

    // Get user's active package selections with package details
    const selections = await userPackageSelectionRepo.find({
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      relations: ["package"],
      order: { createdAt: "DESC" }
    });

    // Transform the data to include package information
    const selectionsWithPackages = selections.map(selection => ({
      id: selection.id,
      packageId: selection.packageId,
      billingCycle: selection.billingCycle,
      selectedPrice: selection.selectedPrice,
      isActive: selection.isActive,
      isCompleted: selection.isCompleted,
      selectionData: selection.selectionData,
      createdAt: selection.createdAt,
      updatedAt: selection.updatedAt,
      package: selection.package ? {
        id: selection.package.id,
        name: selection.package.name,
        description: selection.package.description,
        price: selection.package.price,
        type: selection.package.type,
        features: JSON.parse(selection.package.features || '[]'),
        platforms: JSON.parse(selection.package.platforms || '[]'),
        duration: selection.package.duration,
        budget: selection.package.budget,
        maxCampaigns: selection.package.maxCampaigns,
        maxUsers: selection.package.maxUsers,
        isPopular: selection.package.isPopular,
        isCustom: selection.package.isCustom
      } : null
    }));

    return NextResponse.json({ 
      success: true, 
      selections: selectionsWithPackages,
      message: `Found ${selectionsWithPackages.length} package selections` 
    });
  } catch (error) {
    console.error("Error fetching package selections:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// DELETE /api/user/package-selection - Remove user package selection
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const selectionId = searchParams.get("id");

    if (!selectionId) {
      return NextResponse.json({ error: "Selection ID is required" }, { status: 400 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userPackageSelectionRepo = AppDataSource.getRepository(UserPackageSelection);

    // Find and deactivate the selection
    const selection = await userPackageSelectionRepo.findOne({
      where: { 
        id: selectionId,
        userId: session.user.id 
      }
    });

    if (!selection) {
      return NextResponse.json({ error: "Selection not found" }, { status: 404 });
    }

    // Deactivate instead of delete to maintain history
    selection.isActive = false;
    await userPackageSelectionRepo.save(selection);

    return NextResponse.json({ 
      success: true, 
      message: "Package selection removed successfully" 
    });
  } catch (error) {
    console.error("Error removing package selection:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}


