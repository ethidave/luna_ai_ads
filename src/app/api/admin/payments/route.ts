import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Payment } from "@/lib/entities/Payment";
import { User } from "@/lib/entities/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if database environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.log("Database environment variables not set, returning empty payments array");
      return NextResponse.json({ 
        payments: [],
        message: "Database not configured. Please set up your database environment variables."
      });
    }

    // Initialize database if not already initialized
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");
      } catch (dbError) {
        console.error("Database initialization error:", dbError);
        return NextResponse.json(
          { 
            payments: [],
            error: "Database connection failed",
            message: "Please check your database configuration and ensure PostgreSQL is running."
          }
        );
      }
    }

    const paymentRepo = AppDataSource.getRepository(Payment);
    const userRepo = AppDataSource.getRepository(User);

    // Get all payments with user information
    const payments = await paymentRepo.find({
      relations: ["user"],
      order: { createdAt: "DESC" }
    });

    console.log(`Found ${payments.length} payments in database`);

    // Transform payments to match the expected format
    const paymentsWithStats = payments.map((payment) => ({
      id: payment.id.toString(),
      userId: payment.userId,
      userName: payment.user?.name || "Unknown User",
      userEmail: payment.user?.email || "Unknown Email",
      amount: payment.amount,
      currency: payment.currency || "USD",
      status: payment.status || "pending",
      paymentMethod: payment.paymentMethod || "unknown",
      transactionId: payment.transactionId || "N/A",
      description: payment.description || "No description",
      plan: payment.plan || "Unknown Plan",
      createdAt: payment.createdAt?.toISOString() || "Unknown",
      updatedAt: payment.updatedAt?.toISOString() || "Unknown",
      processedAt: payment.processedAt?.toISOString() || null,
      refundedAt: payment.refundedAt?.toISOString() || null,
      refundAmount: payment.refundAmount || null,
    }));

    console.log(`Processed ${paymentsWithStats.length} payments successfully`);
    return NextResponse.json({ payments: paymentsWithStats });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { 
        payments: [],
        error: "Failed to fetch payments", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentData = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);

    const newPayment = paymentRepo.create({
      userId: paymentData.userId,
      amount: paymentData.amount,
      currency: paymentData.currency || "USD",
      status: paymentData.status || "pending",
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      description: paymentData.description,
      plan: paymentData.plan,
      processedAt: paymentData.processedAt ? new Date(paymentData.processedAt) : null,
      refundedAt: paymentData.refundedAt ? new Date(paymentData.refundedAt) : null,
      refundAmount: paymentData.refundAmount || null,
    });

    await paymentRepo.save(newPayment);

    return NextResponse.json({ success: true, payment: newPayment });

  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, updates } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);
    const existingPayment = await paymentRepo.findOne({ where: { id: paymentId } });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment fields
    Object.assign(existingPayment, updates);
    await paymentRepo.save(existingPayment);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);
    const existingPayment = await paymentRepo.findOne({ where: { id: paymentId } });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    await paymentRepo.remove(existingPayment);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
