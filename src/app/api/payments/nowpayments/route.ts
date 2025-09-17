import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check if NowPayments is configured
    if (!process.env.NOWPAYMENTS_API_KEY) {
      return NextResponse.json(
        { 
          error: 'NowPayments not configured',
          message: 'Please configure NowPayments API key in admin settings'
        },
        { status: 400 }
      );
    }

    const { amount, currency, userId, description, packageId, network } = await request.json();

    // Validate input
    if (!amount || !currency || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least $1' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NOWPAYMENTS_SANDBOX === 'true' 
      ? 'https://api-sandbox.nowpayments.io/v1'
      : 'https://api.nowpayments.io/v1';
    
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    // Generate order ID
    const orderId = `luna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare payment data
    const paymentData = {
      price_amount: amount,
      price_currency: currency.toUpperCase(),
      pay_currency: 'usdt',
      order_id: orderId,
      order_description: description || 'Lunaluna AI Package Purchase',
      ipn_callback_url: `${process.env.NEXTAUTH_URL}/api/payments/nowpayments/webhook`,
      case: 'success',
      case_failed: 'failed',
      ...(network && { pay_currency: `usdt_${network.toLowerCase()}` }),
    };

    // Create payment
    const response = await fetch(`${baseUrl}/payment`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`NowPayments payment creation failed: ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();

    if (result.status !== 'waiting') {
      throw new Error(`NowPayments payment failed: ${result.message || 'Unknown error'}`);
    }

    return NextResponse.json({
      success: true,
      paymentId: result.payment_id,
      orderId: result.order_id,
      amount: result.amount,
      currency: result.pay_currency,
      paymentUrl: result.pay_url,
      qrCode: result.pay_address,
      status: result.payment_status,
      network: network || 'trc20',
    });

  } catch (error) {
    console.error('NowPayments payment error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Payment processing failed',
          message: error.message,
          details: 'Please check your NowPayments configuration'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    // Check if NowPayments is configured
    if (!process.env.NOWPAYMENTS_API_KEY) {
      return NextResponse.json(
        { 
          error: 'NowPayments not configured',
          message: 'Please configure NowPayments API key in admin settings'
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NOWPAYMENTS_SANDBOX === 'true' 
      ? 'https://api-sandbox.nowpayments.io/v1'
      : 'https://api.nowpayments.io/v1';
    
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    // Get payment status
    const response = await fetch(`${baseUrl}/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve NowPayments payment status');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment_id,
        order_id: result.order_id,
        status: result.payment_status,
        amount: result.amount,
        currency: result.pay_currency,
        pay_address: result.pay_address,
        pay_amount: result.pay_amount,
        actually_paid: result.actually_paid,
        created_at: result.created_at,
        updated_at: result.updated_at,
      }
    });

  } catch (error) {
    console.error('NowPayments payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

// Webhook handler for NowPayments
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-nowpayments-sig');

    // Verify webhook signature
    if (process.env.NOWPAYMENTS_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha512', process.env.NOWPAYMENTS_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const data = JSON.parse(body);

    // Process webhook data
    if (data.payment_status === 'finished' || data.payment_status === 'partially_paid') {
      // Update user wallet or subscription
      console.log('Crypto payment completed:', data);
      
      // Here you would typically:
      // 1. Update user wallet balance
      // 2. Activate subscription
      // 3. Send confirmation email
      // 4. Log transaction
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('NowPayments webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
