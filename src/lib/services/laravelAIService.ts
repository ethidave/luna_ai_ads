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
    const response = await apiClient.post<any>('/ai/analyze-campaign', { ...campaignData, platform });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to analyze campaign'
      };
    }
  },

  async generateCopy(prompt: string, platform: string, tone?: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/generate-copy', { prompt, platform, tone });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate copy'
      };
    }
  },

  async generateHashtags(content: string, platform: string, count?: number): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/generate-hashtags', { content, platform, count });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate hashtags'
      };
    }
  },

  async generateTags(content: string, platform: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/generate-tags', { content, platform });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate tags'
      };
    }
  },

  async optimizeContent(content: string, platform: string, objective?: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/optimize-content', { content, platform, objective });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to optimize content'
      };
    }
  },

  async getTrends(platform: string, industry?: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/trends', { platform, industry });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get trends'
      };
    }
  },

  async getOptimalPostTime(platform: string, audienceData?: any): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/optimal-post-time', { platform, audienceData });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get optimal post time'
      };
    }
  },

  async generateContentIdeas(topic: string, platform: string, count?: number): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/content-ideas', { topic, platform, count });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate content ideas'
      };
    }
  },

  async analyzeEngagement(content: string, platform: string, metrics?: any): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/analyze-engagement', { content, platform, metrics });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to analyze engagement'
      };
    }
  },

  async analyzeWebsite(url: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/analyze-website', { url });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to analyze website'
      };
    }
  },

  async generateImage(prompt: string): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/generate-image', { prompt });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate image'
      };
    }
  },

  async predictPerformance(content: string, platform: string, audienceData?: any): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/performance-prediction', { content, platform, audienceData });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to predict performance'
      };
    }
  },

  async getPackageRecommendation(userData: any, goals: any): Promise<AIResponse<any>> {
    const response = await apiClient.post<any>('/ai/package-recommendation', { userData, goals });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get package recommendation'
      };
    }
  },
};