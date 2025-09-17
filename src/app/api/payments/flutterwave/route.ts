import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check if Flutterwave is configured
    if (!process.env.FLUTTERWAVE_SECRET_KEY || !process.env.FLUTTERWAVE_PUBLIC_KEY) {
      return NextResponse.json(
        { 
          error: 'Flutterwave not configured',
          message: 'Please configure Flutterwave API keys in admin settings'
        },
        { status: 400 }
      );
    }

    const { amount, currency, userId, description, packageId, email, phoneNumber, paymentType } = await request.json();

    // Validate input
    if (!amount || !currency || !userId || !email) {
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

    const baseUrl = process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3';
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;

    // Generate transaction reference
    const txRef = `luna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare payment data
    const paymentData = {
      tx_ref: txRef,
      amount: amount,
      currency: currency.toUpperCase(),
      redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      payment_options: paymentType || 'card,mobilemoney,ussd',
      customer: {
        email: email,
        phone_number: phoneNumber || '',
        name: `User ${userId}`,
      },
      customizations: {
        title: 'Lunaluna AI',
        description: description || 'Package Purchase',
        logo: `${process.env.NEXTAUTH_URL}/logo.png`,
      },
      meta: {
        user_id: userId,
        package_id: packageId || '',
        platform: 'lunaluna-ai',
      },
    };

    // Create payment
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Flutterwave payment creation failed: ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();

    if (result.status !== 'success') {
      throw new Error(`Flutterwave payment failed: ${result.message || 'Unknown error'}`);
    }

    return NextResponse.json({
      success: true,
      transactionId: result.data.tx_ref,
      paymentLink: result.data.link,
      amount,
      currency,
      status: result.data.status,
      publicKey,
    });

  } catch (error) {
    console.error('Flutterwave payment error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Payment processing failed',
          message: error.message,
          details: 'Please check your Flutterwave configuration'
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
    const transactionId = searchParams.get('transaction_id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    // Check if Flutterwave is configured
    if (!process.env.FLUTTERWAVE_SECRET_KEY) {
      return NextResponse.json(
        { 
          error: 'Flutterwave not configured',
          message: 'Please configure Flutterwave API keys in admin settings'
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3';
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    // Verify transaction
    const response = await fetch(`${baseUrl}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify Flutterwave transaction');
    }

    const result = await response.json();

    if (result.status !== 'success') {
      throw new Error(`Flutterwave verification failed: ${result.message || 'Unknown error'}`);
    }

    const transaction = result.data;

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        tx_ref: transaction.tx_ref,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        customer: transaction.customer,
        meta: transaction.meta,
      }
    });

  } catch (error) {
    console.error('Flutterwave transaction verification error:', error);
    return NextResponse.json(
      { error: 'Transaction verification failed' },
      { status: 500 }
    );
  }
}

// Webhook handler for Flutterwave
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('verif-hash');

    // Verify webhook signature
    if (process.env.FLUTTERWAVE_SECRET_HASH && signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    // Process webhook data
    if (data.event === 'charge.completed' && data.data.status === 'successful') {
      // Update user wallet or subscription
      console.log('Payment completed:', data.data);
      
      // Here you would typically:
      // 1. Update user wallet balance
      // 2. Activate subscription
      // 3. Send confirmation email
      // 4. Log transaction
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}