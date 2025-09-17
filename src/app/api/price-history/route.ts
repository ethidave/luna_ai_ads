import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { PriceHistory } from "@/lib/entities/PriceHistory";
import { Package } from "@/lib/entities/Package";
import { User } from "@/lib/entities/User";

// GET /api/price-history - Get price history for packages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const priceHistoryRepo = AppDataSource.getRepository(PriceHistory);
    const packageRepo = AppDataSource.getRepository(Package);

    let query = priceHistoryRepo
      .createQueryBuilder("priceHistory")
      .leftJoinAndSelect("priceHistory.package", "package")
      .leftJoinAndSelect("priceHistory.changedByUser", "user")
      .orderBy("priceHistory.createdAt", "DESC")
      .limit(limit)
      .offset(offset);

    // Filter by package if specified
    if (packageId) {
      query = query.where("priceHistory.packageId = :packageId", { packageId: parseInt(packageId) });
    }

    const priceHistory = await query.getMany();

    // Transform the data for frontend
    const transformedHistory = priceHistory.map(record => ({
      id: record.id,
      packageId: record.packageId,
      packageName: record.package?.name || "Unknown Package",
      oldPrice: parseFloat(record.oldPrice.toString()),
      newPrice: parseFloat(record.newPrice.toString()),
      priceChangePercentage: parseFloat(record.priceChangePercentage.toString()),
      changeType: record.changeType,
      billingCycle: record.billingCycle,
      reason: record.reason,
      metadata: record.metadata,
      createdAt: record.createdAt.toISOString(),
      changedBy: record.changedByUser ? {
        id: record.changedByUser.id,
        name: record.changedByUser.name,
        email: record.changedByUser.email
      } : null
    }));

    return NextResponse.json({ 
      success: true, 
      priceHistory: transformedHistory,
      total: transformedHistory.length,
      message: `Retrieved ${transformedHistory.length} price history records` 
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST /api/price-history - Create price history record (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { packageId, oldPrice, newPrice, reason, metadata } = await request.json();

    if (!packageId || oldPrice === undefined || newPrice === undefined) {
      return NextResponse.json({ 
        error: "Missing required fields: packageId, oldPrice, newPrice" 
      }, { status: 400 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const priceHistoryRepo = AppDataSource.getRepository(PriceHistory);
    const packageRepo = AppDataSource.getRepository(Package);

    // Verify package exists
    const packageExists = await packageRepo.findOne({ where: { id: packageId } });
    if (!packageExists) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Calculate price change percentage
    const priceChangePercentage = oldPrice === 0 ? 0 : ((newPrice - oldPrice) / oldPrice) * 100;
    
    // Determine change type
    let changeType = "no_change";
    if (priceChangePercentage > 0) {
      changeType = "increase";
    } else if (priceChangePercentage < 0) {
      changeType = "decrease";
    }

    // Create price history record
    const newPriceHistory = priceHistoryRepo.create({
      packageId: parseInt(packageId),
      changedByUserId: session.user.id,
      oldPrice: parseFloat(oldPrice),
      newPrice: parseFloat(newPrice),
      priceChangePercentage: parseFloat(priceChangePercentage.toFixed(2)),
      changeType: changeType,
      billingCycle: packageExists.type || "monthly",
      reason: reason || "Price updated",
      metadata: metadata || {}
    });

    const savedPriceHistory = await priceHistoryRepo.save(newPriceHistory);

    return NextResponse.json({ 
      success: true, 
      priceHistory: savedPriceHistory,
      message: "Price history record created successfully" 
    });
  } catch (error) {
    console.error("Error creating price history:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}


