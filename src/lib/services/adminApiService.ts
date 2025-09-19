import { apiRequest, getApiUrl } from '../api-utils';

// Types for Admin API responses
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminCampaign {
  id: number;
  name: string;
  description: string;
  platforms: string[];
  status: string;
  objective: string;
  budget: number;
  spent: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AdminPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  status: string;
  features: string[];
  platforms: string[];
  duration: number;
  budget: number;
  max_campaigns: number;
  max_users: number;
  is_popular: boolean;
  is_custom: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminPayment {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  description?: string;
  refund_amount?: number;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaymentSettings {
  stripe: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
    testMode: boolean;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    webhookId: string;
    sandbox: boolean;
    currency: string;
    webhookUrl: string;
  };
  flutterwave: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    testMode: boolean;
  };
  nowpayments: {
    enabled: boolean;
    apiKey: string;
    sandbox: boolean;
  };
  crypto: {
    usdtContract: string;
    tronNetwork: string;
    bscNetwork: string;
    ethNetwork: string;
    platformWallet: string;
  };
}

export interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  totalCampaigns: number;
  totalClicks: number;
  conversionRate: number;
  revenueGrowth: number;
  userGrowth: number;
  campaignGrowth: number;
  clickGrowth: number;
  conversionGrowth: number;
}

export interface PlatformData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DeviceData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TopCampaign {
  id: number;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  status: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

export interface ChartData {
  revenue: ChartDataPoint[];
  clicks: ChartDataPoint[];
  conversions: ChartDataPoint[];
}

export interface AnalyticsResponse {
  analytics: AnalyticsData;
  platformData: PlatformData[];
  deviceData: DeviceData[];
  topCampaigns: TopCampaign[];
  chartData: ChartData;
}

export interface PaymentStats {
  total_payments: number;
  total_revenue: number;
  pending_payments: number;
  failed_payments: number;
  refunded_payments: number;
  refunded_amount: number;
  average_payment: number;
  payment_methods: Array<{
    payment_method: string;
    count: number;
    total: number;
  }>;
  status_breakdown: Array<{
    status: string;
    count: number;
    total: number;
  }>;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Admin API Service Class
export class AdminApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Add admin prefix to endpoint
      const adminEndpoint = `/admin${endpoint}`;
      
      const response = await apiRequest(adminEndpoint, {
        ...options,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        return {
          success: false,
          error: 'Invalid JSON response from server',
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}: Request failed`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Authentication
  async adminLogin(email: string, password: string): Promise<ApiResponse<{ user: AdminUser; token: string }>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async adminLogout(): Promise<ApiResponse<null>> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // User Management
  async getUsers(): Promise<ApiResponse<AdminUser[]>> {
    return this.makeRequest('/users');
  }

  async getUser(id: number): Promise<ApiResponse<AdminUser>> {
    return this.makeRequest(`/users/${id}`);
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    is_admin?: boolean;
  }): Promise<ApiResponse<AdminUser>> {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<{
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
  }>): Promise<ApiResponse<AdminUser>> {
    return this.makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaign Management
  async getCampaigns(): Promise<ApiResponse<AdminCampaign[]>> {
    return this.makeRequest('/campaigns');
  }

  async getCampaign(id: number): Promise<ApiResponse<AdminCampaign>> {
    return this.makeRequest(`/campaigns/${id}`);
  }

  async createCampaign(campaignData: {
    name: string;
    description: string;
    platforms: string[];
    status: string;
    objective: string;
    budget: number;
    budget_type?: string;
    target_audience?: any;
    creative?: any;
    schedule?: any;
    settings?: any;
    start_date?: string;
    end_date?: string;
    targeting?: any;
    objectives?: string[];
  }): Promise<ApiResponse<AdminCampaign>> {
    return this.makeRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async updateCampaign(id: number, campaignData: Partial<{
    name: string;
    description: string;
    platforms: string[];
    status: string;
    objective: string;
    budget: number;
  }>): Promise<ApiResponse<AdminCampaign>> {
    return this.makeRequest(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Package Management
  async getPackages(): Promise<ApiResponse<AdminPackage[]>> {
    return this.makeRequest('/packages');
  }

  async getPackage(id: number): Promise<ApiResponse<AdminPackage>> {
    return this.makeRequest(`/packages/${id}`);
  }

  async createPackage(packageData: {
    name: string;
    description: string;
    price: number;
    type: string;
    status: string;
    features: string[];
    platforms: string[];
    duration: number;
    budget: number;
    max_campaigns: number;
    max_users: number;
    is_popular: boolean;
    is_custom: boolean;
    sort_order: number;
  }): Promise<ApiResponse<AdminPackage>> {
    return this.makeRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  }

  async updatePackage(id: number, packageData: Partial<{
    name: string;
    description: string;
    price: number;
    type: string;
    status: string;
    features: string[];
    platforms: string[];
    duration: number;
    budget: number;
    max_campaigns: number;
    max_users: number;
    is_popular: boolean;
    is_custom: boolean;
    sort_order: number;
  }>): Promise<ApiResponse<AdminPackage>> {
    return this.makeRequest(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  }

  async deletePackage(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`/packages/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment Management
  async getPayments(): Promise<ApiResponse<AdminPayment[]>> {
    return this.makeRequest('/payments');
  }

  async getPayment(id: number): Promise<ApiResponse<AdminPayment>> {
    return this.makeRequest(`/payments/${id}`);
  }

  async updatePayment(id: number, paymentData: {
    status?: string;
    transaction_id?: string;
    gateway_response?: any;
    notes?: string;
  }): Promise<ApiResponse<AdminPayment>> {
    return this.makeRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async refundPayment(id: number, refundData: {
    refund_amount: number;
    reason: string;
    refund_method: string;
  }): Promise<ApiResponse<AdminPayment>> {
    return this.makeRequest(`/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  }

  async deletePayment(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  async getPaymentStats(timeRange: string = '30d'): Promise<ApiResponse<PaymentStats>> {
    return this.makeRequest(`/payment-stats?time_range=${timeRange}`);
  }

  async getPaymentSettings(): Promise<ApiResponse<PaymentSettings>> {
    return this.makeRequest('/payment-settings');
  }

  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<ApiResponse<PaymentSettings>> {
    return this.makeRequest('/payment-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Analytics
  async getAnalytics(timeRange: string = '7d'): Promise<ApiResponse<AnalyticsResponse>> {
    return this.makeRequest(`/analytics?time_range=${timeRange}`);
  }

  // Reports
  async getReports(): Promise<ApiResponse<{
    reports: any[];
    totalReports: number;
    totalDownloads: number;
    totalDataPoints: number;
    readyReports: number;
    realStats: {
      totalRevenue: number;
      totalUsers: number;
      totalCampaigns: number;
      totalPayments: number;
      totalClicks: number;
      totalConversions: number;
      activeCampaigns: number;
      usersThisMonth: number;
    };
  }>> {
    return this.makeRequest('/reports');
  }

  async generateReport(reportData: {
    name: string;
    type: string;
    description: string;
    format: string;
    period: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }
}

// Export singleton instance
export const adminApiService = new AdminApiService();
