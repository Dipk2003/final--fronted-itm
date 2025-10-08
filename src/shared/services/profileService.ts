import { api, handleApiError } from '@/shared/utils/apiClient';

// Profile-related API calls
export const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update user profile
  updateProfile: async (profileData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
  }) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await api.put('/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/profile/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Verify email
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/profile/verify-email', { token });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/profile/resend-verification', {});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  }) => {
    try {
      const response = await api.put('/profile/notifications', preferences);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete account
  deleteAccount: async (password: string) => {
    try {
      const response = await api.delete('/profile', {
        data: { password }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default profileService;
