import { ApiClient } from '@/lib/api-config';

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
  }>;
}

export interface PayPalPaymentData {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  userId: number;
  packageId: number;
}

export interface PayPalPaymentResponse {
  success: boolean;
  orderId?: string;
  approvalUrl?: string;
  error?: string;
  message?: string;
}

export interface PayPalWebhookData {
  id: string;
  event_type: string;
  resource: any;
  create_time: string;
}

const apiClient = new ApiClient();

export const paypalService = {
  /**
   * Create a PayPal order
   */
  async createOrder(paymentData: PayPalPaymentData): Promise<PayPalPaymentResponse> {
    const response = await apiClient.post<PayPalPaymentResponse>('/payments/paypal/create-order', paymentData);
    
    if (response.success) {
      return {
        success: true,
        orderId: response.data?.orderId,
        approvalUrl: response.data?.approvalUrl,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to create PayPal order'
      };
    }
  },

  /**
   * Capture a PayPal order
   */
  async captureOrder(orderId: string): Promise<PayPalPaymentResponse> {
    const response = await apiClient.post<PayPalPaymentResponse>('/payments/paypal/capture-order', { orderId });
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to capture PayPal order'
      };
    }
  },

  /**
   * Get PayPal order details
   */
  async getOrderDetails(orderId: string): Promise<PayPalPaymentResponse> {
    const response = await apiClient.get<PayPalPaymentResponse>(`/payments/paypal/order/${orderId}`);
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get PayPal order details'
      };
    }
  },

  /**
   * Cancel a PayPal order
   */
  async cancelOrder(orderId: string): Promise<PayPalPaymentResponse> {
    const response = await apiClient.post<PayPalPaymentResponse>('/payments/paypal/cancel-order', { orderId });
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to cancel PayPal order'
      };
    }
  },

  /**
   * Refund a PayPal payment
   */
  async refundPayment(captureId: string, amount?: number, reason?: string): Promise<PayPalPaymentResponse> {
    const response = await apiClient.post<PayPalPaymentResponse>('/payments/paypal/refund', {
      captureId,
      amount,
      reason
    });
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to refund PayPal payment'
      };
    }
  },

  /**
   * Get PayPal payment methods
   */
  async getPaymentMethods(): Promise<{ success: boolean; methods?: any[]; error?: string }> {
    const response = await apiClient.get<{ methods: any[] }>('/payments/paypal/methods');
    
    if (response.success) {
      return {
        success: true,
        methods: response.data?.methods || []
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get PayPal payment methods'
      };
    }
  },

  /**
   * Verify PayPal webhook
   */
  async verifyWebhook(webhookData: PayPalWebhookData): Promise<PayPalPaymentResponse> {
    const response = await apiClient.post<PayPalPaymentResponse>('/payments/paypal/verify-webhook', webhookData);
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to verify PayPal webhook'
      };
    }
  }
};

export default paypalService;
