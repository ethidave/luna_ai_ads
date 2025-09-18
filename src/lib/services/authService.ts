import { API_CONFIG } from '../api-config';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified: boolean;
  plan?: string;
  role?: string;
  is_admin: boolean;
  credits: number;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface DeleteAccountData {
  password: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string; user?: User; token?: string }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      console.log('Making auth request to:', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
      });

      console.log('Auth response status:', response.status);

      const responseText = await response.text();
      console.log('Auth raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Auth parsed data:', data);
      } catch (jsonError) {
        console.error('Auth JSON parse error:', jsonError);
        return {
          success: false,
          error: 'Invalid response from server',
        };
      }

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Request failed';
        
        // Handle specific database errors
        if (errorMessage.includes('sessions') || errorMessage.includes('SQLSTATE[42S02]')) {
          errorMessage = 'Database not configured. Please check the Laravel backend setup.';
        } else if (errorMessage.includes('Base table or view not found')) {
          errorMessage = 'Database tables missing. Please run Laravel migrations.';
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('Auth request error:', error);
      let errorMessage = 'Network error';
      
      if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please ensure the Laravel backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // User Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<{ user: User; token: string }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    return {
      success: response.success,
      user: response.user,
      token: response.token,
      error: response.error,
      message: response.message,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest<{ user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return {
      success: response.success,
      user: response.user,
      error: response.error,
      message: response.message,
    };
  }

  async logout(): Promise<AuthResponse> {
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
      {
        method: 'POST',
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  async getUser(): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest<{ user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.USER,
      {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      }
    );

    return {
      success: response.success,
      user: response.user,
      error: response.error,
    };
  }

  // Admin Authentication
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<{ user: User; token: string }>(
      API_CONFIG.ENDPOINTS.ADMIN.AUTH.SIGNIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    return {
      success: response.success,
      user: response.user,
      token: response.token,
      error: response.error,
      message: response.message,
    };
  }

  // Password Reset
  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  // Email Verification
  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  async sendVerification(): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION,
      {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  // Update Profile
  async updateProfile(data: ProfileUpdateData): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest<{ user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data),
      }
    );

    if (response.success && response.user) {
      this.setUser(response.user);
    }

    return {
      success: response.success,
      user: response.user,
      error: response.error,
      message: response.message,
    };
  }

  // Change Password
  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data),
      }
    );

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  // Delete Account
  async deleteAccount(data: DeleteAccountData): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest(
      API_CONFIG.ENDPOINTS.AUTH.ACCOUNT,
      {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data),
      }
    );

    if (response.success) {
      this.clearAuth();
    }

    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
  }

  // Refresh Token
  async refreshToken(): Promise<AuthResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await this.makeRequest<{ token: string }>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      }
    );

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return {
      success: response.success,
      token: response.token,
      error: response.error,
      message: response.message,
    };
  }

  // Token Management
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // User Storage
  setUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  removeUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Clear all auth data
  clearAuth() {
    this.removeToken();
    this.removeUser();
  }
}

export const authService = new AuthService();
