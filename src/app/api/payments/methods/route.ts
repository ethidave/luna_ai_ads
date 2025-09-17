import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/paymentService";

export async function GET(request: NextRequest) {
  try {
    const methods = await paymentService.getAvailablePaymentMethods();
    
    return NextResponse.json({
      success: true,
      methods: methods.filter(method => method.enabled),
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
