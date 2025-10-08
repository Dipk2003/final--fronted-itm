import { api } from './api';

export interface AadharVerificationResponse {
  valid: boolean;
  aadharNumber: string;
  message: string;
  holderName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  status?: string;
  otpSent?: boolean;
  otpReference?: string;
}

export interface AadharOtpVerificationResponse {
  valid: boolean;
  verified: boolean;
  message: string;
  holderName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface PanVerificationResponse {
  valid: boolean;
  panNumber: string;
  message: string;
  holderName?: string;
  category?: string;
  status?: string;
}

// Verification API functions
export const verificationAPI = {
  // Aadhar verification - sends OTP to registered mobile number
  verifyAadhar: async (aadharNumber: string): Promise<AadharVerificationResponse> => {
    const response = await api.post('/verification/aadhar/verify', {
      aadharNumber: aadharNumber
    });
    return response.data;
  },

  // Aadhar OTP verification - verifies the OTP sent to registered mobile
  verifyAadharOtp: async (aadharNumber: string, otp: string, otpReference: string): Promise<AadharOtpVerificationResponse> => {
    const response = await api.post('/verification/aadhar/verify-otp', {
      aadharNumber: aadharNumber,
      otp: otp,
      otpReference: otpReference
    });
    return response.data;
  },

  // PAN verification - validates PAN card number
  verifyPan: async (panNumber: string): Promise<PanVerificationResponse> => {
    const response = await api.post('/verification/pan/verify', {
      panNumber: panNumber
    });
    return response.data;
  },

  // Combined verification for registration
  verifyDocuments: async (aadharNumber: string, panNumber?: string): Promise<{
    aadharResponse: AadharVerificationResponse;
    panResponse?: PanVerificationResponse;
  }> => {
    const verificationData: any = { aadharNumber };
    if (panNumber) {
      verificationData.panNumber = panNumber;
    }

    const response = await api.post('/verification/documents/verify', verificationData);
    return response.data;
  }
};

/*
API Integration Guide:

For Aadhar Verification:
1. Use UIDAI (Unique Identification Authority of India) API or third-party services like:
   - Signzy API
   - IDfy API
   - Digio API
   - KYC API

2. Required API Configuration:
   - API Key/Token from service provider
   - Base URL for the verification service
   - Rate limiting configuration

3. Example API Endpoints you need to configure:
   - POST /verification/aadhar/verify
   - POST /verification/aadhar/verify-otp

For PAN Verification:
1. Use Income Tax Department API or third-party services like:
   - NSDL PAN Verification API
   - Signzy API
   - IDfy API
   - KYC API

2. Required API Configuration:
   - API Key/Token from service provider
   - Base URL for the verification service
   - Rate limiting configuration

3. Example API Endpoints you need to configure:
   - POST /verification/pan/verify

Environment Variables needed:
- AADHAR_API_KEY=your_aadhar_api_key
- AADHAR_API_URL=https://api.provider.com/aadhar
- PAN_API_KEY=your_pan_api_key
- PAN_API_URL=https://api.provider.com/pan

Popular Third-party Services:
1. Signzy (https://signzy.com/)
2. IDfy (https://idfy.com/)
3. Digio (https://www.digio.in/)
4. KYC API (https://kycapi.com/)
*/
