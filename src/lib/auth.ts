import { api } from '@/shared/services/api';

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  userType?: string;
  adminCode?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: string;
  companyName?: string;
}

export interface JwtResponse {
  token: string;
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    isVerified: boolean;
  };
  type?: string;
  userId?: number;
  email?: string;
  roles?: string[];
  expiresIn?: number;
  requiresOTP?: boolean;
  userType?: string;
  userInfo?: {
    userId: number;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    userType: string;
  };
}

export interface VerifyOtpRequest {
  email?: string;
  emailOrPhone?: string;
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

export const authAPI = {
  // Login endpoints
  login: async (credentials: LoginCredentials): Promise<JwtResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Registration endpoints
  register: async (userData: RegisterData): Promise<JwtResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Vendor registration
  registerVendor: async (vendorData: RegisterData): Promise<JwtResponse> => {
    const response = await api.post('/auth/vendor/register', vendorData);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<JwtResponse> => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  // OTP verification
  verifyOtp: async (otpData: VerifyOtpRequest): Promise<JwtResponse> => {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
  },

  // Resend OTP
  resendOtp: async (emailOrPhone: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend-otp', { emailOrPhone });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<JwtResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: any): Promise<any> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Check if user exists
  checkUserExists: async (emailOrPhone: string): Promise<{ exists: boolean; userType?: string }> => {
    const response = await api.post('/auth/check-user', { emailOrPhone });
    return response.data;
  },

  // Validate session
  validateSession: async (): Promise<{ valid: boolean; user?: any }> => {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Send verification email
  sendVerificationEmail: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/send-verification');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await api.delete('/auth/delete-account', {
      data: { password }
    });
    return response.data;
  }
};

// Auth utility functions
export const AuthUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || localStorage.getItem('token');
    }
    return null;
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('vendorId');
      localStorage.removeItem('userId');
    }
  },

  // Get user data from localStorage
  getUser: (): any => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData') || localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Set user data in localStorage
  setUser: (user: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!AuthUtils.getToken();
  },

  // Check user role
  getUserRole: (): string | null => {
    const user = AuthUtils.getUser();
    return user?.role || user?.userType || localStorage.getItem('userRole') || null;
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const userRole = AuthUtils.getUserRole();
    return userRole === role;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return AuthUtils.hasRole('admin');
  },

  // Check if user is vendor
  isVendor: (): boolean => {
    return AuthUtils.hasRole('vendor');
  },

  // Check if user is customer/buyer
  isCustomer: (): boolean => {
    return AuthUtils.hasRole('user') || AuthUtils.hasRole('customer') || AuthUtils.hasRole('buyer');
  },

  // Format user name
  formatUserName: (user: any): string => {
    if (!user) return 'User';
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email?.split('@')[0] || 'User';
  },

  // Decode JWT token (basic implementation)
  decodeToken: (token: string): any => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token?: string): boolean => {
    const tokenToCheck = token || AuthUtils.getToken();
    if (!tokenToCheck) return true;

    try {
      const decoded = AuthUtils.decodeToken(tokenToCheck);
      if (!decoded?.exp) return false; // If no expiration, assume valid
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Auto-refresh token if needed
  refreshTokenIfNeeded: async (): Promise<boolean> => {
    const token = AuthUtils.getToken();
    if (!token) return false;

    if (AuthUtils.isTokenExpired(token)) {
      try {
        const response = await authAPI.refreshToken();
        if (response.token) {
          AuthUtils.setToken(response.token);
          if (response.user) {
            AuthUtils.setUser(response.user);
          }
          return true;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        AuthUtils.removeToken();
        return false;
      }
    }
    return true;
  }
};

export default authAPI;
