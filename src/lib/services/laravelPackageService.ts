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
    try {
      const response = await apiClient.get('/packages');
      return {
        success: true,
        data: { packages: response.data?.packages || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch packages'
      };
    }
  },

  async getAvailablePackages(): Promise<ApiResponse<{ packages: Package[] }>> {
    try {
      const response = await apiClient.get('/packages/available');
      return {
        success: true,
        data: { packages: response.data?.packages || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch available packages'
      };
    }
  },

  async getCurrentPackage(): Promise<ApiResponse<{ package: Package | null; subscription: Subscription | null }>> {
    try {
      const response = await apiClient.get('/packages/current');
      return {
        success: true,
        data: {
          package: response.data.package || null,
          subscription: response.data.subscription || null
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch current package'
      };
    }
  },

  async purchasePackage(data: PurchasePackageData): Promise<ApiResponse<{ subscription: Subscription }>> {
    try {
      const response = await apiClient.post('/packages/purchase', data);
      return {
        success: true,
        data: { subscription: response.data.subscription }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to purchase package'
      };
    }
  },

  async cancelPackage(): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.post('/packages/cancel');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel package'
      };
    }
  },

  async getPackageUpgrades(): Promise<ApiResponse<{ upgrades: Package[] }>> {
    try {
      const response = await apiClient.get('/packages/upgrades');
      return {
        success: true,
        data: { upgrades: response.data.upgrades || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch package upgrades'
      };
    }
  },
};