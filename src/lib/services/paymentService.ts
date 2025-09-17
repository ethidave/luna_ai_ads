import { PaymentMethod } from '@/lib/entities/Payment';
import { Wallet } from '@/lib/entities/Wallet';

export interface PaymentRequest {
  amount: number;
  currency: string;
  userId: string;
  method: PaymentMethod;
  description?: string;
  packageId?: string;
  metadata?: Record<string, any>;
  // Additional fields for specific payment methods
  email?: string;
  phoneNumber?: string;
  paymentType?: string;
  network?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  clientSecret?: string;
  qrCode?: string;
  paymentUrl?: string;
  publicKey?: string;
  orderId?: string;
  error?: string;
  message?: string;
  details?: string;
}

export interface PaymentVerification {
  success: boolean;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  error?: string;
  message?: string;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  enabled: boolean;
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  processingFee: string;
  processingTime: string;
  icon: string;
  description: string;
}

export class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.APP_URL || 'http://localhost:3000';
  }

  /**
   * Create a payment request
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const endpoint = this.getPaymentEndpoint(request.method);
      const response = await fetch(`${this.baseUrl}/api/payments/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          userId: request.userId,
          description: request.description,
          packageId: request.packageId,
          metadata: request.metadata,
          email: request.email,
          phoneNumber: request.phoneNumber,
          paymentType: request.paymentType,
          network: request.network,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Payment creation failed',
          message: data.message,
          details: data.details,
        };
      }

      return {
        success: true,
        paymentId: data.paymentIntentId || data.orderId || data.paymentId || data.transactionId,
        redirectUrl: data.approvalUrl || data.paymentLink || data.paymentUrl,
        clientSecret: data.clientSecret,
        qrCode: data.qrCode || data.qrData,
        publicKey: data.publicKey,
        orderId: data.orderId,
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify a payment
   */
  async verifyPayment(
    method: PaymentMethod,
    transactionId: string
  ): Promise<PaymentVerification> {
    try {
      const endpoint = this.getPaymentEndpoint(method);
      const response = await fetch(
        `${this.baseUrl}/api/payments/${endpoint}?${this.getVerificationParams(method, transactionId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return {
        success: true,
        transactionId: data.paymentIntent?.id || data.order?.id || data.transaction?.id,
        amount: data.paymentIntent?.amount || data.order?.amount || data.transaction?.amount,
        currency: data.paymentIntent?.currency || data.order?.currency || data.transaction?.currency,
        status: data.paymentIntent?.status || data.order?.status || data.transaction?.status,
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update wallet balance after successful payment
   */
  async updateWalletBalance(
    userId: string,
    amount: number,
    currency: string,
    method: PaymentMethod
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          currency,
          method,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Wallet update error:', error);
      return false;
    }
  }

  /**
   * Get supported currencies for a payment method
   */
  getSupportedCurrencies(method: PaymentMethod): string[] {
    switch (method) {
      case PaymentMethod.USDT_TRC20:
        return ['USDT'];
      case PaymentMethod.BNB_BSC:
        return ['BNB'];
      case PaymentMethod.ETH_ERC20:
        return ['ETH'];
      case PaymentMethod.STRIPE:
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];
      case PaymentMethod.PAYPAL:
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF'];
      case PaymentMethod.FLUTTERWAVE:
        return ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'XOF', 'XAF'];
      default:
        return [];
    }
  }

  /**
   * Get minimum and maximum amounts for a payment method
   */
  getAmountLimits(method: PaymentMethod): { min: number; max: number } {
    switch (method) {
      case PaymentMethod.USDT_TRC20:
        return { min: 10, max: 10000 };
      case PaymentMethod.BNB_BSC:
        return { min: 0.01, max: 1000 };
      case PaymentMethod.ETH_ERC20:
        return { min: 0.001, max: 100 };
      case PaymentMethod.STRIPE:
        return { min: 1, max: 50000 };
      case PaymentMethod.PAYPAL:
        return { min: 1, max: 25000 };
      case PaymentMethod.FLUTTERWAVE:
        return { min: 1, max: 10000 };
      default:
        return { min: 1, max: 1000 };
    }
  }

  /**
   * Get processing fees for a payment method
   */
  getProcessingFees(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.USDT_TRC20:
        return '0.1%';
      case PaymentMethod.BNB_BSC:
        return '0.05%';
      case PaymentMethod.ETH_ERC20:
        return '0.2%';
      case PaymentMethod.STRIPE:
        return '2.9% + $0.30';
      case PaymentMethod.PAYPAL:
        return '2.9% + $0.30';
      case PaymentMethod.FLUTTERWAVE:
        return '1.4% - 3.8%';
      default:
        return '2.9%';
    }
  }

  /**
   * Get processing time for a payment method
   */
  getProcessingTime(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.USDT_TRC20:
        return '2-5 minutes';
      case PaymentMethod.BNB_BSC:
        return '1-3 minutes';
      case PaymentMethod.ETH_ERC20:
        return '3-10 minutes';
      case PaymentMethod.STRIPE:
        return 'Instant';
      case PaymentMethod.PAYPAL:
        return 'Instant';
      case PaymentMethod.FLUTTERWAVE:
        return 'Instant';
      default:
        return '1-5 minutes';
    }
  }

  /**
   * Get available payment methods with their status
   */
  async getAvailablePaymentMethods(): Promise<PaymentMethodInfo[]> {
    const methods: PaymentMethodInfo[] = [
      {
        id: 'stripe',
        name: 'Stripe',
        enabled: !!process.env.STRIPE_SECRET_KEY,
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'],
        minAmount: 1,
        maxAmount: 50000,
        processingFee: '2.9% + $0.30',
        processingTime: 'Instant',
        icon: 'credit-card',
        description: 'Credit Card, Debit Card, Apple Pay, Google Pay',
      },
      {
        id: 'paypal',
        name: 'PayPal',
        enabled: !!process.env.PAYPAL_CLIENT_ID,
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF'],
        minAmount: 1,
        maxAmount: 25000,
        processingFee: '2.9% + $0.30',
        processingTime: 'Instant',
        icon: 'wallet',
        description: 'PayPal Balance, Credit Card, Debit Card',
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        enabled: !!process.env.FLUTTERWAVE_SECRET_KEY,
        supportedCurrencies: ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'XOF', 'XAF'],
        minAmount: 1,
        maxAmount: 10000,
        processingFee: '1.4% - 3.8%',
        processingTime: 'Instant',
        icon: 'smartphone',
        description: 'Mobile Money, Bank Transfer, Card',
      },
      {
        id: 'nowpayments',
        name: 'USDT Crypto',
        enabled: !!process.env.NOWPAYMENTS_API_KEY,
        supportedCurrencies: ['USDT'],
        minAmount: 10,
        maxAmount: 10000,
        processingFee: '0.5%',
        processingTime: '2-10 minutes',
        icon: 'coins',
        description: 'USDT via multiple networks (TRC20, ERC20, BSC)',
      },
    ];

    return methods;
  }

  /**
   * Check if a payment method is available
   */
  isPaymentMethodAvailable(method: string): boolean {
    switch (method) {
      case 'stripe':
        return !!process.env.STRIPE_SECRET_KEY;
      case 'paypal':
        return !!process.env.PAYPAL_CLIENT_ID;
      case 'flutterwave':
        return !!process.env.FLUTTERWAVE_SECRET_KEY;
      case 'nowpayments':
        return !!process.env.NOWPAYMENTS_API_KEY;
      default:
        return false;
    }
  }

  /**
   * Get payment method configuration status
   */
  async getPaymentMethodStatus(): Promise<Record<string, boolean>> {
    return {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      paypal: !!process.env.PAYPAL_CLIENT_ID,
      flutterwave: !!process.env.FLUTTERWAVE_SECRET_KEY,
      nowpayments: !!process.env.NOWPAYMENTS_API_KEY,
    };
  }

  /**
   * Get payment endpoint for a method
   */
  private getPaymentEndpoint(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.USDT_TRC20:
      case PaymentMethod.BNB_BSC:
      case PaymentMethod.ETH_ERC20:
        return 'nowpayments';
      case PaymentMethod.STRIPE:
        return 'stripe';
      case PaymentMethod.PAYPAL:
        return 'paypal';
      case PaymentMethod.FLUTTERWAVE:
        return 'flutterwave';
      default:
        return 'stripe';
    }
  }

  /**
   * Get verification parameters for a method
   */
  private getVerificationParams(method: PaymentMethod, transactionId: string): string {
    switch (method) {
      case PaymentMethod.STRIPE:
        return `payment_intent_id=${transactionId}`;
      case PaymentMethod.PAYPAL:
        return `order_id=${transactionId}`;
      case PaymentMethod.FLUTTERWAVE:
        return `transaction_id=${transactionId}`;
      default:
        return `hash=${transactionId}&currency=${method}`;
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: currency === 'USD' ? 2 : 8,
      maximumFractionDigits: currency === 'USD' ? 2 : 8,
    });

    return formatter.format(amount);
  }

  /**
   * Convert amount between currencies (simplified)
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    try {
      // In production, use a real exchange rate API
      const exchangeRateApiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate-api.com/v4/latest';
      const response = await fetch(
        `${exchangeRateApiUrl}/${fromCurrency}`
      );
      const data = await response.json();
      
      const rate = data.rates[toCurrency];
      return amount * rate;
    } catch (error) {
      console.error('Currency conversion error:', error);
      return amount; // Return original amount if conversion fails
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();


