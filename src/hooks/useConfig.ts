import { useState, useEffect } from 'react';
import { 
  configService, 
  FrontendConfig, 
  EnvironmentConfig,
  isFeatureEnabled as checkFeatureEnabled,
  getOAuthConfig as getOAuthConfigValue,
  getSocialMediaConfig as getSocialMediaConfigValue
} from '@/lib/config-service';

export interface UseConfigReturn {
  config: FrontendConfig | null;
  environmentConfig: EnvironmentConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isFeatureEnabled: (feature: keyof FrontendConfig['features']) => boolean;
  getOAuthConfig: (provider: 'google' | 'facebook') => any;
  getSocialMediaConfig: (platform: 'facebook' | 'google_ads') => any;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<FrontendConfig | null>(null);
  const [environmentConfig, setEnvironmentConfig] = useState<EnvironmentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [frontendConfig, envConfig] = await Promise.all([
        configService.getFrontendConfig(),
        configService.getEnvironmentConfig()
      ]);
      
      setConfig(frontendConfig);
      setEnvironmentConfig(envConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
      console.error('Configuration loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await configService.refreshConfig();
    await loadConfig();
  };

  const isFeatureEnabled = (feature: keyof FrontendConfig['features']): boolean => {
    if (!config) return false;
    return checkFeatureEnabled(feature);
  };

  const getOAuthConfig = (provider: 'google' | 'facebook') => {
    if (!config) return null;
    return getOAuthConfigValue(provider);
  };

  const getSocialMediaConfig = (platform: 'facebook' | 'google_ads') => {
    if (!config) return null;
    return getSocialMediaConfigValue(platform);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    environmentConfig,
    loading,
    error,
    refresh,
    isFeatureEnabled,
    getOAuthConfig,
    getSocialMediaConfig,
  };
}

// Hook for checking specific features
export function useFeatureFlag(feature: keyof FrontendConfig['features']) {
  const { config, loading } = useConfig();
  
  return {
    enabled: config?.features[feature] || false,
    loading,
  };
}

// Hook for OAuth configuration
export function useOAuthConfig(provider: 'google' | 'facebook') {
  const { config, loading } = useConfig();
  
  return {
    config: config?.oauth[provider] || null,
    loading,
  };
}

// Hook for social media configuration
export function useSocialMediaConfig(platform: 'facebook' | 'google_ads') {
  const { config, loading } = useConfig();
  
  return {
    config: config?.social_media[platform] || null,
    loading,
  };
}
