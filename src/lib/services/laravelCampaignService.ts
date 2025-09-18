import { ApiClient } from '@/lib/api-config';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  platforms: string[];
  status: string;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignData {
  name: string;
  description: string;
  platforms: string[];
  budget: number;
}

export interface UpdateCampaignData {
  name?: string;
  description?: string;
  platforms?: string[];
  status?: string;
  budget?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const apiClient = new ApiClient();

export const laravelCampaignService = {
  async getCampaigns(): Promise<ApiResponse<{ campaigns: Campaign[] }>> {
    const response = await apiClient.get<{ campaigns: Campaign[] }>('/campaigns');
    
    if (response.success) {
      return {
        success: true,
        data: { campaigns: response.data?.campaigns || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch campaigns'
      };
    }
  },

  async getCampaignById(id: number): Promise<ApiResponse<{ campaign: Campaign }>> {
    const response = await apiClient.get<{ campaign: Campaign }>(`/campaigns/${id}`);
    
    if (response.success) {
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data! },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch campaign'
      };
    }
  },

  async createCampaign(campaignData: CreateCampaignData): Promise<ApiResponse<{ campaign: Campaign }>> {
    const response = await apiClient.post<{ campaign: Campaign }>('/campaigns', campaignData);
    
    if (response.success) {
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data! },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to create campaign'
      };
    }
  },

  async updateCampaign(id: number, campaignData: UpdateCampaignData): Promise<ApiResponse<{ campaign: Campaign }>> {
    const response = await apiClient.put<{ campaign: Campaign }>(`/campaigns/${id}`, campaignData);
    
    if (response.success) {
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data! },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to update campaign'
      };
    }
  },

  async deleteCampaign(id: number): Promise<ApiResponse<{}>> {
    const response = await apiClient.delete(`/campaigns/${id}`);
    
    if (response.success) {
      return { 
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to delete campaign'
      };
    }
  },

  async getCampaignAnalytics(id: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>(`/campaigns/${id}/analytics`);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch analytics'
      };
    }
  },

  async getDashboardData(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/dashboard/data');
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch dashboard data'
      };
    }
  },

  async getSocialMediaAccounts(): Promise<ApiResponse<{ accounts: any[] }>> {
    const response = await apiClient.get<{ accounts: any[] }>('/social-media/accounts');
    
    if (response.success) {
      return {
        success: true,
        data: { accounts: response.data?.accounts || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch social media accounts'
      };
    }
  },

  async getSocialMediaPosts(): Promise<ApiResponse<{ posts: any[] }>> {
    const response = await apiClient.get<{ posts: any[] }>('/social-media/posts');
    
    if (response.success) {
      return {
        success: true,
        data: { posts: response.data?.posts || [] },
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch social media posts'
      };
    }
  },
};