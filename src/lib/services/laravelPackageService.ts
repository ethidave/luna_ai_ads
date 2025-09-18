import { ApiClient } from '@/lib/api-config';

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  monthlyPrice: number;
  yearlyPrice: number;
  type: string;
  status: string;
  features: string[];
  platforms: string[];
  duration: number;
  budget: number;
  max_campaigns: number;
  max_users: number;
  limitations: any[];
  customizations: any[];
  is_popular: boolean;
  is_custom: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  package_id: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface PurchasePackageData {
  package_id: number;
  payment_method_id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const apiClient = new ApiClient();

export const laravelPackageService = {
  async getPackages(): Promise<ApiResponse<{ packages: Package[] }>> {
    const response = await apiClient.get<{ packages: Package[] }>('/packages');
    
    if (response.success) {
      return {
        success: true,
        data: { packages: response.data?.packages || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch packages'
      };
    }
  },

  async getAvailablePackages(): Promise<ApiResponse<{ packages: Package[] }>> {
    const response = await apiClient.get<{ packages: Package[] }>('/packages/available');
    
    if (response.success) {
      return {
        success: true,
        data: { packages: response.data?.packages || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch available packages'
      };
    }
  },

  async getCurrentPackage(): Promise<ApiResponse<{ package: Package | null; subscription: Subscription | null }>> {
    const response = await apiClient.get<{ package: Package | null; subscription: Subscription | null }>('/packages/current');
    
    if (response.success) {
      return {
        success: true,
        data: {
          package: response.data?.package || null,
          subscription: response.data?.subscription || null
        },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch current package'
      };
    }
  },

  async purchasePackage(data: PurchasePackageData): Promise<ApiResponse<{ subscription: Subscription }>> {
    const response = await apiClient.post<{ subscription: Subscription }>('/packages/purchase', data);
    
    if (response.success) {
      return {
        success: true,
        data: { subscription: response.data?.subscription! },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to purchase package'
      };
    }
  },

  async cancelPackage(): Promise<ApiResponse<{}>> {
    const response = await apiClient.post('/packages/cancel');
    
    if (response.success) {
      return { 
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to cancel package'
      };
    }
  },

  async getPackageUpgrades(): Promise<ApiResponse<{ upgrades: Package[] }>> {
    const response = await apiClient.get<{ upgrades: Package[] }>('/packages/upgrades');
    
    if (response.success) {
      return {
        success: true,
        data: { upgrades: response.data?.upgrades || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch package upgrades'
      };
    }
  },
};