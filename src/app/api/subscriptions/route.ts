import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Subscription, SubscriptionStatus } from "@/lib/entities/Subscription";
import { Package } from "@/lib/entities/Package";

// GET /api/subscriptions - Get user's subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const packageRepository = AppDataSource.getRepository(Package);
    
    const subscriptions = await subscriptionRepository.find({
      where: { userId: session.user.id },
      order: { createdAt: 'DESC' }
    });

    // Get package details for each subscription
    const subscriptionsWithPackages = await Promise.all(
      subscriptions.map(async (subscription) => {
        const packageDetails = await packageRepository.findOne({
          where: { id: subscription.planId }
        });
        return {
          ...subscription,
          package: packageDetails
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      subscriptions: subscriptionsWithPackages,
      message: "Subscriptions retrieved successfully" 
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      packageId,
      paymentMethod,
      paymentReference,
      autoRenew = true
    } = body;

    if (!packageId) {
      return NextResponse.json({ 
        error: "Package ID is required" 
      }, { status: 400 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const packageRepository = AppDataSource.getRepository(Package);
    
    // Get package details
    const packageDetails = await packageRepository.findOne({
      where: { id: packageId }
    });

    if (!packageDetails) {
      return NextResponse.json({ 
        error: "Package not found" 
      }, { status: 404 });
    }

    // Check if user already has an active subscription
    const existingSubscription = await subscriptionRepository.findOne({
      where: { 
        userId: session.user.id,
        status: SubscriptionStatus.ACTIVE
      }
    });

    if (existingSubscription) {
      return NextResponse.json({ 
        error: "User already has an active subscription" 
      }, { status: 400 });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + packageDetails.duration);

    const newSubscription = subscriptionRepository.create({
      userId: session.user.id,
      planId: packageId,
      status: SubscriptionStatus.PENDING,
      amount: packageDetails.price,
      startDate,
      endDate,
      paymentMethod,
      transactionId: paymentReference,
      autoRenew
    });

    const savedSubscription = await subscriptionRepository.save(newSubscription);

    return NextResponse.json({ 
      success: true,
      subscription: savedSubscription,
      message: "Subscription created successfully" 
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 });
  }
}