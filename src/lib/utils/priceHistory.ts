import { AppDataSource } from "../database";
import { PriceHistory } from "../entities/PriceHistory";
import { Package } from "../entities/Package";

export interface PriceChangeData {
  packageId: number;
  oldPrice: number;
  newPrice: number;
  changedByUserId: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export async function trackPriceChange(data: PriceChangeData): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const priceHistoryRepo = AppDataSource.getRepository(PriceHistory);
    const packageRepo = AppDataSource.getRepository(Package);

    // Get package details
    const packageData = await packageRepo.findOne({ where: { id: data.packageId } });
    if (!packageData) {
      console.error(`Package with ID ${data.packageId} not found`);
      return;
    }

    // Only track if price actually changed
    if (data.oldPrice === data.newPrice) {
      return;
    }

    // Calculate price change percentage
    const priceChangePercentage = data.oldPrice === 0 ? 0 : 
      ((data.newPrice - data.oldPrice) / data.oldPrice) * 100;
    
    // Determine change type
    let changeType = "no_change";
    if (priceChangePercentage > 0) {
      changeType = "increase";
    } else if (priceChangePercentage < 0) {
      changeType = "decrease";
    }

    // Create price history record
    const priceHistory = priceHistoryRepo.create({
      packageId: data.packageId,
      changedByUserId: data.changedByUserId,
      oldPrice: data.oldPrice,
      newPrice: data.newPrice,
      priceChangePercentage: parseFloat(priceChangePercentage.toFixed(2)),
      changeType: changeType,
      billingCycle: packageData.type || "monthly",
      reason: data.reason || "Price updated",
      metadata: data.metadata || {}
    });

    await priceHistoryRepo.save(priceHistory);
    console.log(`Price history tracked for package ${data.packageId}: ${data.oldPrice} -> ${data.newPrice}`);
  } catch (error) {
    console.error("Error tracking price change:", error);
    // Don't throw error to avoid breaking the main operation
  }
}

export async function getPriceHistoryForPackage(
  packageId: number, 
  limit: number = 10
): Promise<any[]> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const priceHistoryRepo = AppDataSource.getRepository(PriceHistory);

    const history = await priceHistoryRepo.find({
      where: { packageId },
      relations: ["changedByUser"],
      order: { createdAt: "DESC" },
      take: limit
    });

    return history.map(record => ({
      id: record.id,
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
  } catch (error) {
    console.error("Error fetching price history for package:", error);
    return [];
  }
}


