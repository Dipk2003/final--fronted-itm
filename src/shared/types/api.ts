// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Auth Types
export interface LoginRequestDto {
  email: string;
  password: string;
  userType?: 'user' | 'admin' | 'vendor';
  emailOrPhone?: string;
}

export interface JwtResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    isVerified?: boolean;
  };
  email?: string;
  type?: string;
  roles?: string[];
  requiresOTP?: boolean;
  message?: string;
  userType?: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface VerifyOtpRequestDto {
  email?: string;
  emailOrPhone?: string;
  otp: string;
}

export interface SetPasswordDto {
  email: string;
  newPassword: string;
  otp: string;
}

// Re-export RegisterRequestDto from index
export type { RegisterRequestDto } from './index';
