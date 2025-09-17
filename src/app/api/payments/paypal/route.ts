import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { 
          error: 'PayPal not configured',
          message: 'Please configure PayPal API keys in admin settings'
        },
        { status: 400 }
      );
    }

    const { amount, currency, userId, description, packageId } = await request.json();

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

    const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `luna-${Date.now()}`,
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toString(),
          },
          description: description || 'Lunaluna AI Package Purchase',
          custom_id: userId,
          invoice_id: `luna-${packageId || 'package'}-${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: 'Lunaluna AI',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      },
    };

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `luna-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(`PayPal order creation failed: ${errorData.message || 'Unknown error'}`);
    }

    const order = await orderResponse.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      amount,
      currency,
      status: order.status,
      clientId: process.env.PAYPAL_CLIENT_ID,
    });

  } catch (error) {
    console.error('PayPal payment error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Payment processing failed',
          message: error.message,
          details: 'Please check your PayPal configuration'
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
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { 
          error: 'PayPal not configured',
          message: 'Please configure PayPal API keys in admin settings'
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get order details
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to retrieve PayPal order');
    }

    const order = await orderResponse.json();

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        amount: order.purchase_units?.[0]?.amount?.value,
        currency: order.purchase_units?.[0]?.amount?.currency_code,
        custom_id: order.purchase_units?.[0]?.custom_id,
        invoice_id: order.purchase_units?.[0]?.invoice_id,
      }
    });

  } catch (error) {
    console.error('PayPal order verification error:', error);
    return NextResponse.json(
      { error: 'Order verification failed' },
      { status: 500 }
    );
  }
}