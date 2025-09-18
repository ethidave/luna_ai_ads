import { ApiClient } from '@/lib/api-config';

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const apiClient = new ApiClient();

export const laravelAIService = {
  async analyzeCampaign(campaignData: any, platform: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/analyze-campaign', { ...campaignData, platform });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to analyze campaign'
      };
    }
  },

  async generateCopy(prompt: string, platform: string, tone?: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/generate-copy', { prompt, platform, tone });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate copy'
      };
    }
  },

  async generateHashtags(content: string, platform: string, count?: number): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/generate-hashtags', { content, platform, count });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate hashtags'
      };
    }
  },

  async generateTags(content: string, platform: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/generate-tags', { content, platform });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate tags'
      };
    }
  },

  async optimizeContent(content: string, platform: string, objective?: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/optimize-content', { content, platform, objective });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to optimize content'
      };
    }
  },

  async getTrends(platform: string, industry?: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/trends', { platform, industry });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get trends'
      };
    }
  },

  async getOptimalPostTime(platform: string, audienceData?: any): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/optimal-post-time', { platform, audienceData });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get optimal post time'
      };
    }
  },

  async generateContentIdeas(topic: string, platform: string, count?: number): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/content-ideas', { topic, platform, count });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate content ideas'
      };
    }
  },

  async analyzeEngagement(content: string, platform: string, metrics?: any): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/analyze-engagement', { content, platform, metrics });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to analyze engagement'
      };
    }
  },

  async analyzeWebsite(url: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/analyze-website', { url });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to analyze website'
      };
    }
  },

  async generateImage(prompt: string): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/generate-image', { prompt });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate image'
      };
    }
  },

  async predictPerformance(content: string, platform: string, audienceData?: any): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/performance-prediction', { content, platform, audienceData });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to predict performance'
      };
    }
  },

  async getPackageRecommendation(userData: any, goals: any): Promise<AIResponse<any>> {
    try {
      const response = await apiClient.post('/ai/package-recommendation', { userData, goals });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get package recommendation'
      };
    }
  },
};