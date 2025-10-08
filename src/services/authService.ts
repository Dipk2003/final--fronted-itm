import { API_CONFIG, apiRequest } from '@/config/api';

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  expiresIn?: number;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  profileImageUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication Service Class
class AuthenticationService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userData';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  /**
   * Health check for backend connection
   */
  async checkBackendHealth(): Promise<{ healthy: boolean; message: string }> {
    try {
      console.log('🔍 Checking backend health...');
      const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.HEALTH, {
        method: 'GET'
      }, false);
      console.log('✅ Backend is healthy:', response);
      return { healthy: true, message: 'Backend is running' };
    } catch (error: any) {
      console.error('❌ Backend health check failed:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        return { healthy: false, message: `Backend server is not running on ${API_CONFIG.BASE_URL}` };
      }
      return { healthy: false, message: `Backend connection failed: ${error.message}` };
    }
  }

  /**
   * Universal login method that works for all user types
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await apiRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(credentials)
        },
        false
      );

      // Store authentication data
      this.setToken(response.token);
      this.setUserData(response.user);
      
      if (response.refreshToken) {
        this.setRefreshToken(response.refreshToken);
      }

      console.log('✅ Login successful for user:', response.user.email);
      return response;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Role-specific login methods
   */
  async loginAdmin(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Admin login attempt for:', credentials.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.ADMIN.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  async loginVendor(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Vendor login attempt for:', credentials.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.VENDOR.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  async loginBuyer(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Buyer login attempt for:', credentials.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.BUYER.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  async loginEmployee(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Employee login attempt for:', credentials.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.EMPLOYEE.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  /**
   * Universal registration method
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      
      const response = await apiRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify(userData)
        },
        false
      );

      // Store authentication data
      this.handleAuthResponse(response);
      
      console.log('✅ Registration successful for user:', response.user.email);
      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Role-specific registration methods
   */
  async registerVendor(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 Vendor registration attempt for:', userData.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.VENDOR.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  async registerBuyer(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 Buyer registration attempt for:', userData.email);
    const response = await apiRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.BUYER.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData)
      },
      false
    );
    this.handleAuthResponse(response);
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiRequest<UserProfile>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        {
          method: 'GET'
        },
        true // Include auth token
      );
      
      // Update stored user data
      this.setUserData(response);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get user profile:', error);
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        },
        false
      );

      this.handleAuthResponse(response);
      return response;
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      // Clear auth data on refresh failure
      this.clearAuthData();
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiRequest<void>(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        {
          method: 'POST'
        },
        true
      );
    } catch (error) {
      console.error('❌ Logout request failed:', error);
      // Continue with local logout even if server request fails
    } finally {
      this.clearAuthData();
      console.log('✅ User logged out successfully');
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
    return response;
  }

  /**
   * Reset password
   */
  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
    return response;
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(request: OtpVerificationRequest): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
    return response;
  }

  /**
   * Verify OTP
   */
  async verifyOtp(request: OtpVerificationRequest): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
    return response;
  }

  // Token management methods
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUserData(user: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUserData(): UserProfile | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUserData();
    return !!(token && user);
  }

  getUserRole(): string | null {
    const user = this.getUserData();
    return user?.role || null;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    // Clear any additional auth-related data
    localStorage.removeItem('vendorId');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.setToken(response.token);
    this.setUserData(response.user);
    
    if (response.refreshToken) {
      this.setRefreshToken(response.refreshToken);
    }
  }

  /**
   * Check if token is expired (basic check)
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Basic JWT expiry check (decode payload without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, consider expired
    }
  }

  /**
   * Auto-refresh token if needed
   */
  async ensureValidToken(): Promise<string | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    if (this.isTokenExpired()) {
      try {
        const response = await this.refreshToken();
        return response.token;
      } catch {
        this.clearAuthData();
        return null;
      }
    }

    return token;
  }
}

// Export singleton instance
export const authService = new AuthenticationService();

// Export the class for testing/advanced usage
export { AuthenticationService };

// Convenience exports for common use cases
export const {
  login,
  register,
  logout,
  getProfile,
  isAuthenticated,
  getUserData,
  getUserRole,
  checkBackendHealth
} = authService;
