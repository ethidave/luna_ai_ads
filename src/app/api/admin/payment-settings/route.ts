import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { AppDataSource } from "@/lib/database";
import { PaymentSettings } from "@/lib/entities/PaymentSettings";

// Initialize database connection
const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(PaymentSettings);
};

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const paymentSettingsRepo = await initializeDB();

    // Get all payment settings from database
    const settings = await paymentSettingsRepo.find();
    
    // Convert to the expected format
    const formattedSettings = {
      stripe: {
        enabled: false,
        publicKey: "",
        secretKey: "",
        webhookSecret: "",
        testMode: false,
      },
      paypal: {
        enabled: false,
        clientId: "",
        clientSecret: "",
        sandbox: false,
      },
      flutterwave: {
        enabled: false,
        publicKey: "",
        secretKey: "",
        encryptionKey: "",
        testMode: false,
      },
      nowpayments: {
        enabled: false,
        apiKey: "",
        sandbox: false,
      },
      crypto: {
        usdtContract: "",
        tronNetwork: "",
        bscNetwork: "",
        ethNetwork: "",
        platformWallet: "",
      },
    };

    // Populate with database values
    settings.forEach(setting => {
      const config = setting.configuration || {};
      switch (setting.provider) {
        case 'stripe':
          formattedSettings.stripe = {
            enabled: setting.enabled,
            publicKey: config.publicKey || "",
            secretKey: config.secretKey || "",
            webhookSecret: config.webhookSecret || "",
            testMode: setting.testMode,
          };
          break;
        case 'paypal':
          formattedSettings.paypal = {
            enabled: setting.enabled,
            clientId: config.clientId || "",
            clientSecret: config.clientSecret || "",
            sandbox: setting.testMode,
          };
          break;
        case 'flutterwave':
          formattedSettings.flutterwave = {
            enabled: setting.enabled,
            publicKey: config.publicKey || "",
            secretKey: config.secretKey || "",
            encryptionKey: config.encryptionKey || "",
            testMode: setting.testMode,
          };
          break;
        case 'nowpayments':
          formattedSettings.nowpayments = {
            enabled: setting.enabled,
            apiKey: config.apiKey || "",
            sandbox: setting.testMode,
          };
          break;
        case 'crypto':
          formattedSettings.crypto = {
            usdtContract: config.usdtContract || "",
            tronNetwork: config.tronNetwork || "",
            bscNetwork: config.bscNetwork || "",
            ethNetwork: config.ethNetwork || "",
            platformWallet: config.platformWallet || "",
          };
          break;
      }
    });

    return NextResponse.json({
      success: true,
      settings: formattedSettings,
    });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const paymentSettingsRepo = await initializeDB();

    const { settings } = await request.json();
    const updates = [];

    // Helper function to save or update payment settings
    const savePaymentSetting = async (provider: string, config: any, enabled: boolean = false, testMode: boolean = false) => {
      let setting = await paymentSettingsRepo.findOne({ where: { provider } });
      
      if (!setting) {
        setting = paymentSettingsRepo.create({
          provider,
          enabled,
          testMode,
          configuration: config,
        });
      } else {
        setting.enabled = enabled;
        setting.testMode = testMode;
        setting.configuration = { ...setting.configuration, ...config };
      }
      
      await paymentSettingsRepo.save(setting);
      updates.push(`${provider} settings`);
    };

    // Process each payment provider
    if (settings.stripe) {
      const stripeConfig = {
        publicKey: settings.stripe.publicKey || "",
        secretKey: settings.stripe.secretKey || "",
        webhookSecret: settings.stripe.webhookSecret || "",
      };
      await savePaymentSetting('stripe', stripeConfig, settings.stripe.enabled, settings.stripe.testMode);
    }

    if (settings.paypal) {
      const paypalConfig = {
        clientId: settings.paypal.clientId || "",
        clientSecret: settings.paypal.clientSecret || "",
      };
      await savePaymentSetting('paypal', paypalConfig, settings.paypal.enabled, settings.paypal.sandbox);
    }

    if (settings.flutterwave) {
      const flutterwaveConfig = {
        publicKey: settings.flutterwave.publicKey || "",
        secretKey: settings.flutterwave.secretKey || "",
        encryptionKey: settings.flutterwave.encryptionKey || "",
      };
      await savePaymentSetting('flutterwave', flutterwaveConfig, settings.flutterwave.enabled, settings.flutterwave.testMode);
    }

    if (settings.nowpayments) {
      const nowpaymentsConfig = {
        apiKey: settings.nowpayments.apiKey || "",
      };
      await savePaymentSetting('nowpayments', nowpaymentsConfig, settings.nowpayments.enabled, settings.nowpayments.sandbox);
    }

    if (settings.crypto) {
      const cryptoConfig = {
        usdtContract: settings.crypto.usdtContract || "",
        tronNetwork: settings.crypto.tronNetwork || "",
        bscNetwork: settings.crypto.bscNetwork || "",
        ethNetwork: settings.crypto.ethNetwork || "",
        platformWallet: settings.crypto.platformWallet || "",
      };
      await savePaymentSetting('crypto', cryptoConfig, true, false);
    }

    // Update environment variables for immediate use
    await updateEnvironmentVariables(settings);

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} payment settings`,
      updates,
    });
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return NextResponse.json(
      { error: "Failed to update payment settings" },
      { status: 500 }
    );
  }
}

// Helper function to update environment variables
async function updateEnvironmentVariables(settings: any) {
  if (settings.stripe) {
    if (settings.stripe.secretKey) process.env.STRIPE_SECRET_KEY = settings.stripe.secretKey;
    if (settings.stripe.publicKey) process.env.STRIPE_PUBLIC_KEY = settings.stripe.publicKey;
    if (settings.stripe.webhookSecret) process.env.STRIPE_WEBHOOK_SECRET = settings.stripe.webhookSecret;
  }

  if (settings.paypal) {
    if (settings.paypal.clientId) process.env.PAYPAL_CLIENT_ID = settings.paypal.clientId;
    if (settings.paypal.clientSecret) process.env.PAYPAL_CLIENT_SECRET = settings.paypal.clientSecret;
  }

  if (settings.flutterwave) {
    if (settings.flutterwave.publicKey) process.env.FLUTTERWAVE_PUBLIC_KEY = settings.flutterwave.publicKey;
    if (settings.flutterwave.secretKey) process.env.FLUTTERWAVE_SECRET_KEY = settings.flutterwave.secretKey;
    if (settings.flutterwave.encryptionKey) process.env.FLUTTERWAVE_ENCRYPTION_KEY = settings.flutterwave.encryptionKey;
  }

  if (settings.nowpayments) {
    if (settings.nowpayments.apiKey) process.env.NOWPAYMENTS_API_KEY = settings.nowpayments.apiKey;
    if (settings.nowpayments.sandbox !== undefined) process.env.NOWPAYMENTS_SANDBOX = settings.nowpayments.sandbox.toString();
  }

  if (settings.crypto) {
    if (settings.crypto.usdtContract) process.env.USDT_CONTRACT_ADDRESS = settings.crypto.usdtContract;
    if (settings.crypto.tronNetwork) process.env.TRON_NETWORK = settings.crypto.tronNetwork;
    if (settings.crypto.bscNetwork) process.env.BSC_NETWORK = settings.crypto.bscNetwork;
    if (settings.crypto.ethNetwork) process.env.ETH_NETWORK = settings.crypto.ethNetwork;
    if (settings.crypto.platformWallet) process.env.PLATFORM_WALLET_ADDRESS = settings.crypto.platformWallet;
  }
}

// New endpoint for testing payment methods
export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth(request);
    const paymentSettingsRepo = await initializeDB();

    const { provider, testMode = true } = await request.json();

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      );
    }

    const setting = await paymentSettingsRepo.findOne({ where: { provider } });
    
    if (!setting) {
      return NextResponse.json(
        { error: "Payment provider not configured" },
        { status: 404 }
      );
    }

    // Test the payment provider
    const testResult = await testPaymentProvider(provider, setting.configuration, testMode);
    
    // Update test status
    setting.lastTested = new Date();
    setting.testStatus = testResult.success ? 'success' : 'failed';
    setting.testMessage = testResult.message;
    await paymentSettingsRepo.save(setting);

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      provider,
      testMode,
    });
  } catch (error) {
    console.error("Error testing payment provider:", error);
    return NextResponse.json(
      { error: "Failed to test payment provider" },
      { status: 500 }
    );
  }
}

// Helper function to test payment providers
async function testPaymentProvider(provider: string, config: any, testMode: boolean) {
  try {
    switch (provider) {
      case 'stripe':
        return await testStripe(config, testMode);
      case 'paypal':
        return await testPayPal(config, testMode);
      case 'flutterwave':
        return await testFlutterwave(config, testMode);
      case 'nowpayments':
        return await testNowPayments(config, testMode);
      default:
        return { success: false, message: 'Unknown payment provider' };
    }
  } catch (error) {
    return { success: false, message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testStripe(config: any, testMode: boolean) {
  if (!config.secretKey) {
    return { success: false, message: 'Stripe secret key not configured' };
  }

  try {
    const stripe = require('stripe')(config.secretKey);
    // Test by creating a test payment intent
    await stripe.paymentIntents.create({
      amount: 100, // $1.00
      currency: 'usd',
      metadata: { test: 'true' },
    });
    return { success: true, message: 'Stripe API key is valid' };
  } catch (error: any) {
    return { success: false, message: `Stripe test failed: ${error.message}` };
  }
}

async function testPayPal(config: any, testMode: boolean) {
  if (!config.clientId || !config.clientSecret) {
    return { success: false, message: 'PayPal credentials not configured' };
  }

  try {
    const baseUrl = testMode ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (response.ok) {
      return { success: true, message: 'PayPal credentials are valid' };
    } else {
      const errorData = await response.json();
      return { success: false, message: `PayPal test failed: ${errorData.error_description || 'Invalid credentials'}` };
    }
  } catch (error: any) {
    return { success: false, message: `PayPal test failed: ${error.message}` };
  }
}

async function testFlutterwave(config: any, testMode: boolean) {
  if (!config.secretKey || !config.publicKey) {
    return { success: false, message: 'Flutterwave credentials not configured' };
  }

  try {
    const baseUrl = process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3';
    const response = await fetch(`${baseUrl}/banks/NG`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'Flutterwave API key is valid' };
    } else {
      const errorData = await response.json();
      return { success: false, message: `Flutterwave test failed: ${errorData.message || 'Invalid API key'}` };
    }
  } catch (error: any) {
    return { success: false, message: `Flutterwave test failed: ${error.message}` };
  }
}

async function testNowPayments(config: any, testMode: boolean) {
  if (!config.apiKey) {
    return { success: false, message: 'NowPayments API key not configured' };
  }

  try {
    const baseUrl = testMode 
      ? process.env.NOWPAYMENTS_SANDBOX_URL || 'https://api-sandbox.nowpayments.io/v1'
      : process.env.NOWPAYMENTS_PROD_URL || 'https://api.nowpayments.io/v1';
    const response = await fetch(`${baseUrl}/status`, {
      method: 'GET',
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'NowPayments API key is valid' };
    } else {
      const errorData = await response.json();
      return { success: false, message: `NowPayments test failed: ${errorData.message || 'Invalid API key'}` };
    }
  } catch (error: any) {
    return { success: false, message: `NowPayments test failed: ${error.message}` };
  }
}