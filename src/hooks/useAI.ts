import { useState } from 'react';
import { laravelAIService, AIResponse } from '@/lib/services/laravelAIService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCampaign = async (campaignData: any, platform: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.analyzeCampaign(campaignData, platform);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to analyze campaign';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateCopy = async (prompt: string, platform: string, tone?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.generateCopy(prompt, platform, tone);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to generate copy';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateHashtags = async (content: string, platform: string, count?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.generateHashtags(content, platform, count);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to generate hashtags';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateTags = async (content: string, platform: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.generateTags(content, platform);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to generate tags';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async (content: string, platform: string, objective?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.optimizeContent(content, platform, objective);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to optimize content';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getTrends = async (platform: string, industry?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.getTrends(platform, industry);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to get trends';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getOptimalPostTime = async (platform: string, audienceData?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.getOptimalPostTime(platform, audienceData);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to get optimal post time';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateContentIdeas = async (topic: string, platform: string, count?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.generateContentIdeas(topic, platform, count);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to generate content ideas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const analyzeEngagement = async (content: string, platform: string, metrics?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.analyzeEngagement(content, platform, metrics);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to analyze engagement';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const analyzeWebsite = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.analyzeWebsite(url);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to analyze website';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.generateImage(prompt);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to generate image';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const predictPerformance = async (content: string, platform: string, audienceData?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.predictPerformance(content, platform, audienceData);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to predict performance';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getPackageRecommendation = async (userData: any, goals: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelAIService.getPackageRecommendation(userData, goals);
      return response;
    } catch (err) {
      const errorMessage = 'Failed to get package recommendation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analyzeCampaign,
    generateCopy,
    generateHashtags,
    generateTags,
    optimizeContent,
    getTrends,
    getOptimalPostTime,
    generateContentIdeas,
    analyzeEngagement,
    analyzeWebsite,
    generateImage,
    predictPerformance,
    getPackageRecommendation,
  };
};

