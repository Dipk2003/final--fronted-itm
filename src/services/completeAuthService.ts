import apiClient, { ApiResponse, getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// Authentication Types
export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  userType?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface OTPRequest {
  emailOrPhone: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
}

// Complete Authentication Service
class CompleteAuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'userData';
  private readonly ROLE_KEY = 'userRole';

  // ===================
  // REGISTRATION METHODS
  // ===================

  async registerUser(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/register', {
        ...data,
        role: 'ROLE_USER',
        userType: 'user'
      });
      toast.success('Registration successful! Please check your email for OTP.');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async registerVendor(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/vendor/register', {
        ...data,
        role: 'ROLE_VENDOR',
        userType: 'vendor'
      });
      toast.success('Vendor registration successful! Please check your email for OTP.');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async registerAdmin(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/admin/register', {
        ...data,
        role: 'ADMIN',
        userType: 'admin'
      });
      toast.success('Admin registration successful!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async registerSupport(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/support/register', {
        ...data,
        role: 'SUPPORT',
        userType: 'support'
      });
      toast.success('Support account registered successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async registerCTO(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/cto/register', {
        ...data,
        role: 'CTO',
        userType: 'cto'
      });
      toast.success('CTO account registered successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async registerDataEntry(data: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/data-entry/register', {
        ...data,
        role: 'DATA_ENTRY',
        userType: 'data_entry'
      });
      toast.success('Data Entry account registered successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  // ===================
  // LOGIN METHODS
  // ===================

  async login(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/login', credentials);
      
      if (typeof response === 'string') {
        // OTP required
        toast('OTP sent to your email/phone. Please verify to continue.', { icon: 'ℹ️' });
        return response;
      }
      
      // Direct login successful
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginBuyer(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/buyer/login', credentials);
      return this.handleLoginResponse(response, 'Buyer login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginVendor(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/seller/login', credentials);
      return this.handleLoginResponse(response, 'Vendor login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginAdmin(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/admin/login', credentials);
      return this.handleLoginResponse(response, 'Admin login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginSupport(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/support/login', credentials);
      return this.handleLoginResponse(response, 'Support login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginCTO(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/cto/login', credentials);
      return this.handleLoginResponse(response, 'CTO login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async loginDataEntry(credentials: LoginRequest): Promise<AuthResponse | string> {
    try {
      const response = await apiClient.post<AuthResponse | string>('/auth/data-entry/login', credentials);
      return this.handleLoginResponse(response, 'Data Entry login successful!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  // ===================
  // OTP METHODS
  // ===================

  async sendLoginOTP(credentials: LoginRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/login-otp', credentials);
      toast.success('OTP sent successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async verifyOTP(otpData: OTPRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-otp', otpData);
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  // ===================
  // PASSWORD METHODS
  // ===================

  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/forgot-password', data);
      toast.success('Password reset OTP sent to your email!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-forgot-password-otp', data);
      this.handleAuthSuccess(response);
      toast.success('Password reset successful! You are now logged in.');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>('/auth/change-password', data);
      toast.success('Password changed successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  // ===================
  // PROFILE METHODS
  // ===================

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      this.setUserData(response);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', data);
      this.setUserData(response);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  async checkEmailRole(email: string): Promise<{ exists: boolean; role?: string; userType?: string }> {
    try {
      const response = await apiClient.post<{ exists: boolean; role?: string; userType?: string }>('/auth/check-email-role', { email });
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  private handleLoginResponse(response: AuthResponse | string, successMessage: string): AuthResponse | string {
    if (typeof response === 'string') {
      // OTP required
      toast('OTP sent to your email/phone. Please verify to continue.', { icon: 'ℹ️' });
      return response;
    }
    
    // Direct login successful
    this.handleAuthSuccess(response);
    toast.success(successMessage);
    return response;
  }

  private handleAuthSuccess(authResponse: AuthResponse): void {
    const { token, refreshToken, user } = authResponse;
    
    // Store authentication data
    apiClient.setToken(token);
    if (refreshToken) {
      apiClient.setRefreshToken(refreshToken);
    }
    this.setUserData(user);
    this.setUserRole(user.role);
    
    console.log('✅ Authentication successful for:', user.email);
  }

  // ===================
  // STORAGE METHODS
  // ===================

  public isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  public getUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  public getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  public setUserData(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public setUserRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  public logout(): void {
    // Clear all stored data
    apiClient.clearAuthData();
    localStorage.clear();
    
    toast.success('Logged out successfully!');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  // ===================
  // ROLE CHECKING METHODS
  // ===================

  public hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('CTO');
  }

  public isVendor(): boolean {
    return this.hasRole('ROLE_VENDOR');
  }

  public isBuyer(): boolean {
    return this.hasRole('ROLE_USER');
  }

  public isSupport(): boolean {
    return this.hasRole('SUPPORT');
  }

  public isDataEntry(): boolean {
    return this.hasRole('DATA_ENTRY');
  }

  public isCTO(): boolean {
    return this.hasRole('CTO');
  }

  // ===================
  // HEALTH CHECK
  // ===================

  public async checkBackendHealth(): Promise<{ healthy: boolean; message: string }> {
    try {
      const isHealthy = await apiClient.healthCheck();
      if (isHealthy) {
        return { healthy: true, message: 'Backend is running smoothly' };
      }
      return { healthy: false, message: 'Backend is not responding' };
    } catch (error) {
      return { healthy: false, message: `Backend connection failed: ${getErrorMessage(error)}` };
    }
  }
}

// Export singleton instance
export const authService = new CompleteAuthService();
export default authService;