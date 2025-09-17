import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Subscription } from "@/lib/entities/Subscription";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    // Get user's active subscription
    const activeSubscription = await subscriptionRepository.findOne({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    if (!activeSubscription) {
      return NextResponse.json({ 
        error: "No active package found",
        message: "You don't have an active package to cancel"
      }, { status: 404 });
    }

    // Cancel the subscription
    activeSubscription.status = 'cancelled';
    activeSubscription.autoRenew = false;
    activeSubscription.updatedAt = new Date();
    activeSubscription.notes = `Cancelled by user on ${new Date().toISOString()}`;

    await subscriptionRepository.save(activeSubscription);

    return NextResponse.json({
      success: true,
      message: "Package cancelled successfully",
      subscription: {
        id: activeSubscription.id,
        status: activeSubscription.status,
        endDate: activeSubscription.endDate,
        cancelledAt: new Date()
      }
    });

  } catch (error) {
    console.error("Error cancelling package:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
