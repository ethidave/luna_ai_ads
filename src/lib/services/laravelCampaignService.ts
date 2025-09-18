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
    try {
      const response = await apiClient.get('/campaigns');
      return {
        success: true,
        data: { campaigns: response.data?.campaigns || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch campaigns'
      };
    }
  },

  async getCampaignById(id: number): Promise<ApiResponse<{ campaign: Campaign }>> {
    try {
      const response = await apiClient.get(`/campaigns/${id}`);
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch campaign'
      };
    }
  },

  async createCampaign(campaignData: CreateCampaignData): Promise<ApiResponse<{ campaign: Campaign }>> {
    try {
      const response = await apiClient.post('/campaigns', campaignData);
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create campaign'
      };
    }
  },

  async updateCampaign(id: number, campaignData: UpdateCampaignData): Promise<ApiResponse<{ campaign: Campaign }>> {
    try {
      const response = await apiClient.put(`/campaigns/${id}`, campaignData);
      return {
        success: true,
        data: { campaign: response.data?.campaign || response.data }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update campaign'
      };
    }
  },

  async deleteCampaign(id: number): Promise<ApiResponse<{}>> {
    try {
      await apiClient.delete(`/campaigns/${id}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete campaign'
      };
    }
  },

  async getCampaignAnalytics(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`/campaigns/${id}/analytics`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  },

  async getDashboardData(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/dashboard/data');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard data'
      };
    }
  },

  async getSocialMediaAccounts(): Promise<ApiResponse<{ accounts: any[] }>> {
    try {
      const response = await apiClient.get('/social-media/accounts');
      return {
        success: true,
        data: { accounts: response.data.accounts || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch social media accounts'
      };
    }
  },

  async getSocialMediaPosts(): Promise<ApiResponse<{ posts: any[] }>> {
    try {
      const response = await apiClient.get('/social-media/posts');
      return {
        success: true,
        data: { posts: response.data.posts || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch social media posts'
      };
    }
  },
};