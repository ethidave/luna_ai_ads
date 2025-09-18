import { useState, useEffect, useCallback } from 'react';
import { 
  authService, 
  User, 
  AuthResponse, 
  ChangePasswordData, 
  ProfileUpdateData, 
  DeleteAccountData 
} from '@/lib/services/authService';

export const useLaravelAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // First check localStorage for existing user data
      const storedUser = authService.getUserFromStorage();
      const storedToken = authService.getToken();
      
      if (storedUser && storedToken) {
        console.log('Found stored user:', storedUser);
        setUser(storedUser);
        setError(null);
        setLoading(false);
        return;
      }
      
      // If no stored user or token, check with server
      const response = await authService.getUser();
      
      if (response.success && response.user) {
        setUser(response.user);
        authService.setUser(response.user);
        setError(null);
      } else {
        setUser(null);
        setError(response.error || 'Not authenticated');
      }
    } catch (err) {
      setUser(null);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });

      if (response.success && response.user && response.token) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        setUser(response.user);
        return response;
      } else {
        setError(response.error || 'Login failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin Login
  const adminLogin = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.adminLogin({ email, password });

      if (response.success && response.user && response.token) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        setUser(response.user);
        return response;
      } else {
        setError(response.error || 'Admin login failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Admin login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register({ name, email, password, password_confirmation });

      if (response.success && response.user) {
        setUser(response.user);
        authService.setUser(response.user);
        return response;
      } else {
        setError(response.error || 'Registration failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      
      const response = await authService.logout();
      
      // Clear local storage
      authService.clearAuth();
      setUser(null);
      setError(null);
      
      return { success: true, message: 'Logged out successfully' };
    } catch (err) {
      // Even if logout fails on server, clear local state
      authService.clearAuth();
      setUser(null);
      setError(null);
      return { success: true, message: 'Logged out successfully' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        return response;
      } else {
        setError(response.error || 'Failed to send reset email');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string, password_confirmation: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.resetPassword({ token, password, password_confirmation });
      
      if (response.success) {
        return response;
      } else {
        setError(response.error || 'Password reset failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.verifyEmail(token);
      
      if (response.success) {
        // Refresh user data after verification
        await checkAuth();
        return response;
      } else {
        setError(response.error || 'Email verification failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Email verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  // Send verification email
  const sendVerification = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.sendVerification();
      
      if (response.success) {
        return response;
      } else {
        setError(response.error || 'Failed to send verification email');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Failed to send verification email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        return response;
      } else {
        setError(response.error || 'Profile update failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Change Password
  const changePassword = useCallback(async (data: ChangePasswordData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.changePassword(data);
      
      if (response.success) {
        return response;
      } else {
        setError(response.error || 'Password change failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Account
  const deleteAccount = useCallback(async (data: DeleteAccountData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.deleteAccount(data);
      
      if (response.success) {
        setUser(null);
        return response;
      } else {
        setError(response.error || 'Account deletion failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Account deletion failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh Token
  const refreshToken = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.refreshToken();
      
      if (response.success) {
        return response;
      } else {
        setError(response.error || 'Token refresh failed');
        return response;
      }
    } catch (err) {
      const errorMessage = 'Token refresh failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    adminLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerification,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshToken,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
  };
};
