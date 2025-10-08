import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/modules/core/services/authService';
import { LoginCredentials, RegisterRequestDto as SharedRegisterRequestDto } from '@/shared/types/index';
import { LoginRequestDto as ApiLoginRequestDto } from '@/shared/types/api';

// Define request types (local alias for backward compatibility)
export interface LoginRequestDto {
  emailOrPhone: string;
  password: string;
  userType?: string;
}

export interface VerifyOtpRequestDto {
  email?: string;
  emailOrPhone?: string;
  otp: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  userType: string;
  phone?: string;
}

// Define User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'vendor' | 'admin' | 'buyer';
  profileImage?: string;
  isVerified?: boolean;
  roles?: string[];
  userType?: string;
  phone?: string;
}

// Define TempCredentials interface
export interface TempCredentials {
  emailOrPhone: string;
  password?: string;
  userType?: string;
}

// Define Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  tempCredentials: TempCredentials | null;
  requiresOTP: boolean;
  pendingEmail?: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  otpSent: false,
  tempCredentials: null,
  requiresOTP: false,
  pendingEmail: undefined,
};

// Updated auth thunks using the real auth service
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequestDto & { userType?: string }, { rejectWithValue }) => {
    try {
      // Convert to the format expected by authService
      const authCredentials: ApiLoginRequestDto = {
        email: credentials.emailOrPhone,
        password: credentials.password,
        userType: credentials.userType as 'user' | 'admin' | 'vendor',
        emailOrPhone: credentials.emailOrPhone
      };
      const result = await authService.login(authCredentials);
      
      console.log('🔑 Login result:', { user: result.user, role: result.user?.role, roles: result.roles });
      
      if (result.requiresOTP) {
        return {
          requiresOTP: true,
          message: result.message,
          pendingEmail: result.email,
          userType: result.userType
        };
      }
      
      return {
        user: {
          id: result.user?.id?.toString() || '1',
          email: result.user?.email || result.email || '',
          name: result.user?.name || 'User',
          role: (result.user?.role || result.roles?.[0]?.replace('ROLE_', '').toLowerCase() || 'user') as 'user' | 'vendor' | 'admin' | 'buyer',
          roles: result.user?.role ? [result.user.role] : result.roles,
          isVerified: result.user?.isVerified || true
        },
        token: result.token
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData: VerifyOtpRequestDto, { rejectWithValue }) => {
    try {
      const result = await authService.verifyOtp(otpData);
      
      console.log('🔑 OTP verification result:', { user: result.user, role: result.user?.role, roles: result.roles });
      
      return {
        user: {
          id: result.user?.id?.toString() || '1',
          email: result.user?.email || result.email || '',
          name: result.user?.name || 'User',
          role: (result.user?.role || result.roles?.[0]?.replace('ROLE_', '').toLowerCase() || 'user') as 'user' | 'vendor' | 'admin' | 'buyer',
          roles: result.user?.role ? [result.user.role] : result.roles,
          isVerified: result.user?.isVerified || true
        },
        token: result.token
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequestDto, { rejectWithValue }) => {
    try {
      // Convert local RegisterRequestDto to SharedRegisterRequestDto
      const sharedUserData: SharedRegisterRequestDto = {
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        phoneNumber: userData.phone || '',
        password: userData.password,
        confirmPassword: userData.password, // For registration, assume they match
        role: userData.userType,
        userType: userData.userType as 'user' | 'admin' | 'vendor'
      };
      const result = await authService.register(sharedUserData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Additional auth thunks for compatibility
export const sendForgotPasswordOtp = createAsyncThunk(
  'auth/sendForgotPasswordOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  'auth/verifyForgotPasswordOtp',
  async (otpData: VerifyOtpRequestDto, { rejectWithValue }) => {
    try {
      const result = await authService.verifyOtp(otpData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData: { email: string; newPassword: string; otp: string }, { rejectWithValue }) => {
    try {
      // This would need to be implemented in authService
      const result = await authService.resetPassword?.(resetData) || { success: true };
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkEmailRole = createAsyncThunk(
  'auth/checkEmailRole',
  async (email: string, { rejectWithValue }) => {
    try {
      // This would need to be implemented in authService
      const result = await authService.checkEmailRole?.(email) || { role: 'user' };
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Alias for registerUser to match expected imports
export const register = registerUser;

// Initialize auth state from localStorage on app load
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getAuthToken();
      const user = authService.getCurrentUserFromStorage();
      
      if (token && user) {
        // Token exists, verify if it's still valid by making a test API call
        try {
          // Optionally verify token with backend - for now just trust localStorage
          return {
            user: {
              id: user.userId?.toString() || user.id,
              email: user.email,
              name: user.firstName || user.name || 'User',
              role: (user.roles?.[0]?.replace('ROLE_', '').toLowerCase() || user.role?.toLowerCase() || 'user') as 'user' | 'vendor' | 'admin' | 'buyer',
              roles: user.roles,
              isVerified: true
            },
            token
          };
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          return rejectWithValue('Token expired');
        }
      }
      
      return rejectWithValue('No auth data found');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
    return true;
  }
);

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      return initialState;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setTempCredentials: (state, action) => {
      state.tempCredentials = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.requiresOTP) {
          state.requiresOTP = true;
          state.otpSent = true;
          state.pendingEmail = action.payload.pendingEmail;
          state.error = null;
        } else if (action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.requiresOTP = false;
          state.otpSent = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.requiresOTP = false;
      });

    // OTP Verification cases
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.requiresOTP = false;
        state.otpSent = false;
        state.pendingEmail = undefined;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Registration cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // Registration might require email verification
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout cases
    builder.addCase(logout.fulfilled, () => {
      return initialState;
    });

    // Initialize Auth cases
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        // Don't set error for initialize auth failure - just remain logged out
        state.isAuthenticated = false;
        state.user = null;
      });

    // Forgot Password cases
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetAuth, setOtpSent, setTempCredentials } = authSlice.actions;
export default authSlice.reducer;
