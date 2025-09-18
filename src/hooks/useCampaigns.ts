import { useState, useEffect } from 'react';
import { laravelCampaignService, Campaign, CreateCampaignData, UpdateCampaignData } from '@/lib/services/laravelCampaignService';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelCampaignService.getCampaigns();
      
      if (response.success && response.data?.campaigns) {
        setCampaigns(response.data.campaigns);
      } else {
        setError(response.error || 'Failed to fetch campaigns');
      }
    } catch (err) {
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (data: CreateCampaignData) => {
    try {
      setError(null);
      const response = await laravelCampaignService.createCampaign(data);
      
      if (response.success && response.data?.campaign) {
        setCampaigns(prev => [response.data!.campaign, ...prev]);
        return { success: true, campaign: response.data.campaign };
      } else {
        setError(response.error || 'Failed to create campaign');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to create campaign';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateCampaign = async (id: number, data: UpdateCampaignData) => {
    try {
      setError(null);
      const response = await laravelCampaignService.updateCampaign(id, data);
      
      if (response.success && response.data?.campaign) {
        setCampaigns(prev => 
          prev.map(campaign => 
            campaign.id === id ? response.data!.campaign : campaign
          )
        );
        return { success: true, campaign: response.data.campaign };
      } else {
        setError(response.error || 'Failed to update campaign');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to update campaign';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteCampaign = async (id: number) => {
    try {
      setError(null);
      const response = await laravelCampaignService.deleteCampaign(id);
      
      if (response.success) {
        setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
        return { success: true };
      } else {
        setError(response.error || 'Failed to delete campaign');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to delete campaign';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};

