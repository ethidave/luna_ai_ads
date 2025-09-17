import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppDataSource } from "@/lib/database";
import { Plan, PlanType, BillingCycle } from "@/lib/entities/Plan";
import { Subscription } from "@/lib/entities/Subscription";
import { Payment, PaymentType, PaymentStatus, PaymentMethod } from "@/lib/entities/Payment";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { packageId, paymentMethod, paymentData } = body;

    if (!packageId || !paymentMethod) {
      return NextResponse.json({ 
        error: "Missing required fields: packageId and paymentMethod are required" 
      }, { status: 400 });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const planRepository = AppDataSource.getRepository(Plan);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const paymentRepository = AppDataSource.getRepository(Payment);

    // Handle both UUID and string package IDs
    let planDetails;
    
    // Check if packageId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(packageId)) {
      // It's a valid UUID, search by ID
      planDetails = await planRepository.findOne({
        where: { id: packageId }
      });
    } else {
      // It's a string, create a temporary plan based on the string ID
      const planMapping = {
        'starter': {
          type: 'starter',
          name: 'Starter',
          description: 'For small businesses & startups looking for simple, AI-driven ad automation.',
          price: 29.9,
          billingCycle: 'weekly',
          features: [
            '1-Min Ad Setup',
            'Facebook Ads Management',
            'Google Ads Management',
            '24/7 Ad Campaign Optimization',
            'AI Market Research',
            'AI Budget Optimizer & Performance Forecasts',
            'AI Ad Copy & Image Generation',
            'Expert Ad Targeting Strategy',
            'Top-performing Audiences',
            'Live Data Insights',
            'Customer Support'
          ],
          limitations: [
            'Up to 2 Ad Accounts',
            'Daily Budget Cap: $500'
          ],
          isActive: true,
          isPopular: false,
          maxFacebookAccounts: 2,
          dailyBudgetCap: 500,
          hasUnlimitedBudget: false,
          hasTeamCollaboration: false,
          hasDedicatedConsultant: false
        },
        'professional': {
          type: 'professional',
          name: 'Professional',
          description: 'For growing businesses that need advanced AI optimization and multi-platform management.',
          price: 79.9,
          billingCycle: 'weekly',
          features: [
            'Everything in Starter',
            'Instagram Ads Management',
            'TikTok Ads Management',
            'Advanced AI Optimization',
            'A/B Testing Automation',
            'Competitor Analysis',
            'Advanced Targeting Options',
            'Custom Audience Creation',
            'Performance Forecasting',
            'Priority Support',
            'Up to 5 Ad Accounts',
            'Daily Budget Cap: $2,000'
          ],
          limitations: [
            'Up to 5 Ad Accounts',
            'Daily Budget Cap: $2,000'
          ],
          isActive: true,
          isPopular: true,
          maxFacebookAccounts: 5,
          dailyBudgetCap: 2000,
          hasUnlimitedBudget: false,
          hasTeamCollaboration: true,
          hasDedicatedConsultant: false
        },
        'enterprise': {
          type: 'enterprise',
          name: 'Enterprise',
          description: 'For large businesses and agencies that need unlimited access and dedicated support.',
          price: 199.9,
          billingCycle: 'weekly',
          features: [
            'Everything in Professional',
            'Unlimited Ad Accounts',
            'Unlimited Budget',
            'White-label Solutions',
            'API Access',
            'Custom Integrations',
            'Dedicated Account Manager',
            '24/7 Phone Support',
            'Custom Reporting',
            'Team Collaboration Tools',
            'Advanced Analytics',
            'Priority Feature Requests'
          ],
          limitations: [],
          isActive: true,
          isPopular: false,
          maxFacebookAccounts: 999,
          dailyBudgetCap: null,
          hasUnlimitedBudget: true,
          hasTeamCollaboration: true,
          hasDedicatedConsultant: true
        }
      };

      const planData = planMapping[packageId.toLowerCase()];
      if (planData) {
        // Check if plan already exists in database
        const existingPlan = await planRepository.findOne({
          where: { type: planData.type }
        });
        
        if (existingPlan) {
          // Use existing plan
          planDetails = existingPlan;
        } else {
          // Create the plan in the database
          const crypto = await import('crypto');
          const tempId = crypto.randomUUID();
          
          // Create plan in database with proper enum values
          const plan = planRepository.create({
            id: tempId,
            type: planData.type === 'starter' ? PlanType.STARTER : 
                  planData.type === 'professional' ? PlanType.PROFESSIONAL : 
                  planData.type === 'enterprise' ? PlanType.ENTERPRISE : PlanType.STARTER,
            name: planData.name,
            description: planData.description,
            price: planData.price,
            billingCycle: planData.billingCycle === 'weekly' ? BillingCycle.WEEKLY : BillingCycle.WEEKLY,
            originalPrice: planData.originalPrice,
            discountPercentage: planData.discountPercentage,
            features: planData.features,
            limitations: planData.limitations,
            isActive: planData.isActive,
            isPopular: planData.isPopular,
            maxFacebookAccounts: planData.maxFacebookAccounts,
            dailyBudgetCap: planData.dailyBudgetCap,
            hasUnlimitedBudget: planData.hasUnlimitedBudget,
            hasTeamCollaboration: planData.hasTeamCollaboration,
            hasDedicatedConsultant: planData.hasDedicatedConsultant
          });
          
          planDetails = await planRepository.save(plan);
        }
      } else {
        // Try to find by type or name in database
        planDetails = await planRepository.findOne({
          where: [
            { type: packageId },
            { name: packageId }
          ]
        });
      }
    }

    if (!planDetails) {
      return NextResponse.json({ 
        error: "Plan not found",
        message: `No plan found with ID: ${packageId}` 
      }, { status: 404 });
    }

    // Process payment based on method
    let paymentResult;
    switch (paymentMethod) {
      case 'paypal':
        paymentResult = await processPayPalPayment(planDetails, paymentData);
        break;
      case 'flutterwave':
        paymentResult = await processFlutterwavePayment(planDetails, paymentData);
        break;
      case 'nowpayments':
        paymentResult = await processNowPaymentsPayment(planDetails, paymentData);
        break;
      default:
        return NextResponse.json({ 
          error: "Unsupported payment method" 
        }, { status: 400 });
    }

    if (!paymentResult.success) {
      return NextResponse.json({ 
        error: "Payment failed",
        message: paymentResult.message 
      }, { status: 400 });
    }

    // Create subscription with proper expiration date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Default 30 days for plans
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Check if user already has an active subscription
    const existingSubscription = await subscriptionRepository.findOne({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    // If user has active subscription, check if they're trying to buy the same package
    if (existingSubscription) {
      const existingPlan = await planRepository.findOne({
        where: { id: existingSubscription.planId }
      });
      
      if (existingPlan && existingPlan.type === planDetails.type) {
        return NextResponse.json({ 
          error: "Package already purchased",
          message: `You already have an active ${planDetails.name} package. You can only upgrade to a higher package or wait for it to expire.`,
          currentPackage: {
            name: existingPlan.name,
            type: existingPlan.type,
            price: existingPlan.price,
            endDate: existingSubscription.endDate
          }
        }, { status: 400 });
      }
    }

    let savedSubscription;
    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.status = 'active';
      existingSubscription.startDate = startDate;
      existingSubscription.endDate = endDate;
      existingSubscription.amount = planDetails.price;
      existingSubscription.paymentMethod = paymentMethod;
      existingSubscription.notes = `Plan Type: ${planDetails.type || packageId}`;
      existingSubscription.updatedAt = new Date();
      
      savedSubscription = await subscriptionRepository.save(existingSubscription);
    } else {
      // Create new subscription - simplified to save only package and day length
      const subscription = subscriptionRepository.create({
        userId: session.user.id,
        planId: planDetails.id,
        status: 'active',
        startDate,
        endDate,
        amount: planDetails.price,
        paymentMethod,
        notes: `Package: ${planDetails.name}, Days: ${daysRemaining}`
      });

      savedSubscription = await subscriptionRepository.save(subscription);
    }

    // Create payment record with proper enum values
    const payment = paymentRepository.create({
      userId: session.user.id,
      type: PaymentType.DEPOSIT, // Package purchase is a deposit
      status: PaymentStatus.COMPLETED,
      method: paymentMethod === 'paypal' ? PaymentMethod.PAYPAL :
              paymentMethod === 'flutterwave' ? PaymentMethod.FLUTTERWAVE :
              paymentMethod === 'nowpayments' ? PaymentMethod.NOWPAYMENTS : PaymentMethod.PAYPAL,
      amount: planDetails.price,
      description: `Package Purchase: ${planDetails.name}`,
      metadata: {
        subscriptionId: savedSubscription.id,
        transactionId: paymentResult.transactionId,
        paymentData: paymentData,
        packageType: planDetails.type || packageId
      }
    });

    await paymentRepository.save(payment);

    return NextResponse.json({
      success: true,
      subscription: savedSubscription,
      payment: payment,
      message: "Package purchased successfully! You can now create campaigns."
    });

  } catch (error) {
    console.error("Error purchasing package:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}

// Payment processing functions

async function processPayPalPayment(planDetails: any, paymentData: any) {
  try {
    // Simulate PayPal payment processing
    console.log('Processing PayPal payment for plan:', planDetails.name);
    console.log('Amount:', planDetails.price);
    console.log('Payment data:', paymentData);
    
    return {
      success: true,
      transactionId: `paypal_${Date.now()}`,
      message: "Payment processed successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "PayPal payment failed: " + error.message
    };
  }
}

async function processFlutterwavePayment(planDetails: any, paymentData: any) {
  try {
    // Flutterwave mobile money payment processing
    console.log('Processing Flutterwave mobile money payment for plan:', planDetails.name);
    console.log('Amount:', planDetails.price);
    console.log('Payment data:', paymentData);
    
    // Flutterwave mobile money configuration
    const flutterwaveConfig = {
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      txRef: `luna_mobile_${Date.now()}`,
      amount: planDetails.price,
      currency: 'USD',
      paymentOptions: paymentData.paymentType || 'mobilemoney',
      customer: {
        email: paymentData.email,
        phone_number: paymentData.phoneNumber
      },
      customizations: {
        title: `Luna AI - ${planDetails.name}`,
        description: `Mobile Money Payment for ${planDetails.name} plan`,
        logo: process.env.APP_URL + '/logo.png'
      }
    };
    
    return {
      success: true,
      transactionId: `flutterwave_mobile_${Date.now()}`,
      message: "Redirecting to Flutterwave mobile money payment",
      redirectUrl: `https://checkout.flutterwave.com/v3/hosted/pay/${flutterwaveConfig.txRef}`,
      paymentData: flutterwaveConfig
    };
  } catch (error) {
    return {
      success: false,
      message: "Flutterwave mobile money payment failed: " + error.message
    };
  }
}

async function processNowPaymentsPayment(planDetails: any, paymentData: any) {
  try {
    // NowPayments USDT payment processing
    console.log('Processing NowPayments USDT payment for plan:', planDetails.name);
    console.log('Amount:', planDetails.price);
    console.log('Payment data:', paymentData);
    
    // NowPayments configuration
    const nowPaymentsConfig = {
      apiKey: process.env.NOWPAYMENTS_API_KEY,
      sandbox: process.env.NOWPAYMENTS_SANDBOX === 'true',
      orderId: `luna_usdt_${Date.now()}`,
      orderDescription: `Luna AI - ${planDetails.name} Plan`,
      priceAmount: planDetails.price,
      priceCurrency: 'usd',
      payCurrency: 'usdt',
      network: paymentData.network || 'ethereum',
      customerEmail: paymentData.email || 'customer@luna-ai.com',
      ipnCallbackUrl: `${process.env.APP_URL}/api/payments/nowpayments/callback`,
      successUrl: `${process.env.APP_URL}/dashboard?payment=success`,
      cancelUrl: `${process.env.APP_URL}/dashboard?payment=cancelled`
    };
    
    // In a real implementation, you would:
    // 1. Create payment request with NowPayments API
    // 2. Get payment URL from NowPayments
    // 3. Redirect user to NowPayments checkout
    
    return {
      success: true,
      transactionId: `nowpayments_${Date.now()}`,
      message: "Redirecting to NowPayments for USDT payment",
      redirectUrl: `https://nowpayments.io/payment/?iid=${nowPaymentsConfig.orderId}`,
      paymentData: nowPaymentsConfig
    };
  } catch (error) {
    return {
      success: false,
      message: "NowPayments USDT payment failed: " + error.message
    };
  }
}
