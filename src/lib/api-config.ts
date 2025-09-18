import { safeJsonParse } from './json-parser';

// API Configuration for Laravel Backend
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      USER: '/auth/user',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
      ACCOUNT: '/auth/account',
      CHANGE_PASSWORD: '/auth/change-password',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      SEND_VERIFICATION: '/auth/send-verification',
      GOOGLE: '/auth/google',
      FACEBOOK: '/auth/facebook',
    },
    // Campaigns
    CAMPAIGNS: {
      LIST: '/campaigns',
      CREATE: '/campaigns',
      SHOW: (id: string) => `/campaigns/${id}`,
      UPDATE: (id: string) => `/campaigns/${id}`,
      DELETE: (id: string) => `/campaigns/${id}`,
      ANALYTICS: (id: string) => `/campaigns/${id}/analytics`,
    },
    // Packages
    PACKAGES: {
      LIST: '/packages',
      AVAILABLE: '/packages/available',
      CURRENT: '/packages/current',
      PURCHASE: '/packages/purchase',
      CANCEL: '/packages/cancel',
      UPGRADES: '/packages/upgrades',
    },
    // Payments
    PAYMENTS: {
      LIST: '/payments',
      CREATE: '/payments',
      SHOW: (id: string) => `/payments/${id}`,
      UPDATE: (id: string) => `/payments/${id}`,
      DELETE: (id: string) => `/payments/${id}`,
      STRIPE: '/payments/stripe',
      PAYPAL: '/payments/paypal',
      FLUTTERWAVE: '/payments/flutterwave',
      NOWPAYMENTS: '/payments/nowpayments',
      DEPOSIT: '/payments/deposit',
      METHODS: '/payments/methods',
    },
    // AI Services
    AI: {
      ANALYZE_CAMPAIGN: '/ai/analyze-campaign',
      GENERATE_COPY: '/ai/generate-copy',
      GENERATE_HASHTAGS: '/ai/generate-hashtags',
      GENERATE_TAGS: '/ai/generate-tags',
      OPTIMIZE_CONTENT: '/ai/optimize-content',
      TRENDS: '/ai/trends',
      OPTIMAL_POST_TIME: '/ai/optimal-post-time',
      CONTENT_IDEAS: '/ai/content-ideas',
      ANALYZE_ENGAGEMENT: '/ai/analyze-engagement',
      ANALYZE_WEBSITE: '/ai/analyze-website',
      GENERATE_IMAGE: '/ai/generate-image',
      PERFORMANCE_PREDICTION: '/ai/performance-prediction',
      PACKAGE_RECOMMENDATION: '/ai/package-recommendation',
    },
    // Dashboard
    DASHBOARD: {
      DATA: '/dashboard/data',
    },
    // Social Media
    SOCIAL_MEDIA: {
      ACCOUNTS: '/social-media/accounts',
      POSTS: '/social-media/posts',
    },
    // Admin
    ADMIN: {
      // Authentication
      AUTH: {
        SIGNIN: '/admin/auth/signin',
        LOGOUT: '/admin/auth/logout',
      },
      // User Management
      USERS: '/admin/users',
      USER: (id: string) => `/admin/users/${id}`,
      // Campaign Management
      CAMPAIGNS: '/admin/campaigns',
      CAMPAIGN: (id: string) => `/admin/campaigns/${id}`,
      // Package Management
      PACKAGES: '/admin/packages',
      PACKAGE: (id: string) => `/admin/packages/${id}`,
      // Payment Management
      PAYMENTS: '/admin/payments',
      PAYMENT: (id: string) => `/admin/payments/${id}`,
      PAYMENT_REFUND: (id: string) => `/admin/payments/${id}/refund`,
      PAYMENT_STATS: '/admin/payment-stats',
      PAYMENT_SETTINGS: '/admin/payment-settings',
      // Analytics
      ANALYTICS: '/admin/analytics',
      // Reports
      REPORTS: '/admin/reports',
      // Legacy endpoints for backward compatibility
      DASHBOARD: '/admin/dashboard',
      CREATE_USER: '/admin/users',
      UPDATE_USER: (id: string) => `/admin/users/${id}`,
      DELETE_USER: (id: string) => `/admin/users/${id}`,
      CREATE_PACKAGE: '/admin/packages',
      UPDATE_PACKAGE: (id: string) => `/admin/packages/${id}`,
      DELETE_PACKAGE: (id: string) => `/admin/packages/${id}`,
      SEED_ADMIN: '/admin/seed-admin',
      SEED_PACKAGES: '/admin/seed-packages',
    },
  },
};

// API Client class for making requests to Laravel backend
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string; user?: any; token?: string }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      console.log('Making API request to:', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON data:', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        return {
          success: false,
          error: 'Invalid JSON response from server',
        };
      }

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Request failed';
        
        // Handle specific database errors
        if (errorMessage.includes('sessions') || errorMessage.includes('SQLSTATE[42S02]')) {
          errorMessage = 'Database not configured. Please check the Laravel backend setup.';
        } else if (errorMessage.includes('Base table or view not found')) {
          errorMessage = 'Database tables missing. Please run Laravel migrations.';
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        // Include user and token if they exist at root level (for auth responses)
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a default instance
export const apiClient = new ApiClient();
