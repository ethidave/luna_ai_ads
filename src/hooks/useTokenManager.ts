import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

interface TokenInfo {
  valid: boolean;
  payload?: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  expiresAt?: string;
  timeUntilExpiration?: number;
  needsRefresh?: boolean;
}

export function useTokenManager() {
  const { data: session, status, update } = useSession();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check token validity
  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.accessToken || ''}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTokenInfo(data);
        return data.valid;
      } else {
        setTokenInfo({ valid: false });
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setTokenInfo({ valid: false });
      return false;
    }
  }, [session?.accessToken]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return false;
    
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update session with new token
        await update({
          ...session,
          accessToken: data.token,
          refreshToken: data.refreshToken,
          expires: data.expiresAt,
        });

        setTokenInfo({
          valid: true,
          payload: {
            id: session?.user?.id || '',
            email: session?.user?.email || '',
            name: session?.user?.name || '',
            image: session?.user?.image || '',
          },
          expiresAt: data.expiresAt,
          timeUntilExpiration: data.expiresIn * 1000,
          needsRefresh: false,
        });

        return true;
      } else {
        console.error('Token refresh failed');
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [session, update, isRefreshing]);

  // Auto-refresh token when needed
  useEffect(() => {
    if (status === 'authenticated' && session) {
      checkTokenValidity();
      
      // Set up auto-refresh interval
      const interval = setInterval(async () => {
        const isValid = await checkTokenValidity();
        if (!isValid) {
          // Try to refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            // If refresh fails, user needs to re-login
            console.log('Token refresh failed, user needs to re-login');
          }
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [status, session, checkTokenValidity, refreshToken]);

  // Check if token is about to expire (less than 1 hour)
  const isTokenExpiringSoon = useCallback(() => {
    if (!tokenInfo?.timeUntilExpiration) return false;
    return tokenInfo.timeUntilExpiration < 60 * 60 * 1000; // 1 hour
  }, [tokenInfo]);

  // Get formatted time until expiration
  const getTimeUntilExpiration = useCallback(() => {
    if (!tokenInfo?.timeUntilExpiration) return null;
    
    const hours = Math.floor(tokenInfo.timeUntilExpiration / (1000 * 60 * 60));
    const minutes = Math.floor((tokenInfo.timeUntilExpiration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, [tokenInfo]);

  return {
    tokenInfo,
    isRefreshing,
    checkTokenValidity,
    refreshToken,
    isTokenExpiringSoon: isTokenExpiringSoon(),
    timeUntilExpiration: getTimeUntilExpiration(),
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}

