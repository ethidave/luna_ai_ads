// Configuration Service for fetching frontend config from Laravel backend
import { apiClient } from './api-config';

export interface FrontendConfig {
  app: {
    name: string;
    url: string;
  };
  features: {
    ai_enabled: boolean;
    crypto_payments: boolean;
    social_login: boolean;
    analytics: boolean;
  };
  oauth: {
    google: {
      client_id: string;
    };
    facebook: {
      client_id: string;
    };
  };
  social_media: {
    facebook: {
      app_id: string;
    };
    google_ads: {
      client_id: string;
    };
  };
  ai: {
    gemini_enabled: boolean;
  };
}

export interface EnvironmentConfig {
  environment: string;
  debug: boolean;
  api_url: string;
  frontend_url: string;
}

class ConfigService {
  private config: FrontendConfig | null = null;
  private environmentConfig: EnvironmentConfig | null = null;
  private configPromise: Promise<FrontendConfig> | null = null;

  /**
   * Get frontend configuration from Laravel backend
   */
  async getFrontendConfig(): Promise<FrontendConfig> {
    if (this.config) {
      return this.config;
    }

    if (this.configPromise) {
      return this.configPromise;
    }

    this.configPromise = this.fetchFrontendConfig();
    this.config = await this.configPromise;
    return this.config;
  }

  /**
   * Get environment configuration
   */
  async getEnvironmentConfig(): Promise<EnvironmentConfig> {
    if (this.environmentConfig) {
      return this.environmentConfig;
    }

    const response = await apiClient.get<EnvironmentConfig>('/config/environment');
    if (response.success && response.data) {
      this.environmentConfig = response.data;
    } else {
      // Fallback to local environment variables
      this.environmentConfig = {
        environment: process.env.NODE_ENV || 'development',
        debug: process.env.NODE_ENV === 'development',
        api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
        frontend_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      };
    }

    return this.environmentConfig;
  }

  /**
   * Get a specific configuration value
   */
  async getConfigValue<T>(path: string): Promise<T | null> {
    const config = await this.getFrontendConfig();
    const keys = path.split('.');
    let value: any = config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    return value as T;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(feature: keyof FrontendConfig['features']): Promise<boolean> {
    const config = await this.getFrontendConfig();
    return config.features[feature] || false;
  }

  /**
   * Get OAuth configuration
   */
  async getOAuthConfig(provider: 'google' | 'facebook') {
    const config = await this.getFrontendConfig();
    return config.oauth[provider];
  }

  /**
   * Get social media configuration
   */
  async getSocialMediaConfig(platform: 'facebook' | 'google_ads') {
    const config = await this.getFrontendConfig();
    return config.social_media[platform];
  }

  /**
   * Refresh configuration from backend
   */
  async refreshConfig(): Promise<void> {
    this.config = null;
    this.environmentConfig = null;
    this.configPromise = null;
    await this.getFrontendConfig();
  }

  private async fetchFrontendConfig(): Promise<FrontendConfig> {
    try {
      const response = await apiClient.get<FrontendConfig>('/config/frontend');
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to fetch frontend config from backend, using fallback');
    }

    // Fallback configuration from environment variables
    return {
      app: {
        name: process.env.APP_NAME || 'Lunaluna AI',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      features: {
        ai_enabled: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true',
        crypto_payments: process.env.NEXT_PUBLIC_ENABLE_CRYPTO_PAYMENTS === 'true',
        social_login: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
        analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      },
      oauth: {
        google: {
          client_id: process.env.GOOGLE_CLIENT_ID || '',
        },
        facebook: {
          client_id: process.env.FACEBOOK_CLIENT_ID || '',
        },
      },
      social_media: {
        facebook: {
          app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        },
        google_ads: {
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        },
      },
      ai: {
        gemini_enabled: !!process.env.GEMINI_API_KEY,
      },
    };
  }
}

// Export singleton instance
export const configService = new ConfigService();

// Export convenience functions
export const getFrontendConfig = () => configService.getFrontendConfig();
export const getEnvironmentConfig = () => configService.getEnvironmentConfig();
export const getConfigValue = <T>(path: string) => configService.getConfigValue<T>(path);
export const isFeatureEnabled = (feature: keyof FrontendConfig['features']) => 
  configService.isFeatureEnabled(feature);
export const getOAuthConfig = (provider: 'google' | 'facebook') => 
  configService.getOAuthConfig(provider);
export const getSocialMediaConfig = (platform: 'facebook' | 'google_ads') => 
  configService.getSocialMediaConfig(platform);
export const refreshConfig = () => configService.refreshConfig();
