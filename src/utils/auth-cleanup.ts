/**
 * Authentication Cleanup Utility
 * ===============================
 * 
 * This utility automatically cleans up expired or invalid JWT tokens
 * from localStorage to prevent authentication errors.
 */

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export class AuthCleanup {
  private static readonly AUTH_KEYS = [
    'authToken',
    'user',
    'token',
    'userRole',
    'userData',
    'vendorId',
    'userId',
    'refreshToken'
  ];

  /**
   * Check if a JWT token is valid and not expired
   */
  private static isTokenValid(token: string): boolean {
    try {
      // Split the token
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Decode the payload
      const payload: JWTPayload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          console.log('🕐 Token expired at:', new Date(payload.exp * 1000).toISOString());
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('❌ Invalid token format:', error);
      return false;
    }
  }

  /**
   * Clean up expired or invalid tokens
   */
  static cleanup(): void {
    console.log('🧹 Starting auth cleanup...');

    let hasChanges = false;

    // Check main auth token
    const authToken = localStorage.getItem('authToken');
    if (authToken && !this.isTokenValid(authToken)) {
      console.log('🗑️ Removing expired authToken');
      localStorage.removeItem('authToken');
      hasChanges = true;
    }

    // Check alternative token storage
    const token = localStorage.getItem('token');
    if (token && !this.isTokenValid(token)) {
      console.log('🗑️ Removing expired token');
      localStorage.removeItem('token');
      hasChanges = true;
    }

    // If any token was invalid, clear all related auth data
    if (hasChanges) {
      console.log('🧽 Clearing all related auth data...');
      this.AUTH_KEYS.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log(`   Removing: ${key}`);
          localStorage.removeItem(key);
        }
      });
      
      console.log('✅ Auth cleanup completed - invalid/expired tokens removed');
    } else {
      console.log('✅ Auth cleanup completed - no issues found');
    }
  }

  /**
   * Initialize auth cleanup - call this on app startup
   */
  static initialize(): void {
    console.log('🚀 Initializing auth cleanup...');
    
    // Run immediate cleanup
    this.cleanup();

    // Set up periodic cleanup every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);

    console.log('✅ Auth cleanup initialized');
  }

  /**
   * Get token info for debugging
   */
  static getTokenInfo(tokenKey: string = 'authToken'): any {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { error: 'Invalid token format' };
      }

      const payload: JWTPayload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return {
        payload,
        isExpired: payload.exp ? payload.exp < currentTime : false,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiration',
        timeToExpiry: payload.exp ? payload.exp - currentTime : null,
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'Unknown'
      };
    } catch (error) {
      return { error: 'Failed to decode token', details: error };
    }
  }

  /**
   * Manual clear all auth data
   */
  static clearAll(): void {
    console.log('🧹 Manually clearing all auth data...');
    
    this.AUTH_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`   Removing: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Also clear sessionStorage
    this.AUTH_KEYS.forEach(key => {
      if (sessionStorage.getItem(key)) {
        console.log(`   Removing from session: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('✅ All auth data manually cleared');
  }
}

// Export for use in app initialization
export const initAuthCleanup = AuthCleanup.initialize.bind(AuthCleanup);
export const clearAllAuth = AuthCleanup.clearAll.bind(AuthCleanup);
export const getTokenInfo = AuthCleanup.getTokenInfo.bind(AuthCleanup);

// For debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).authCleanup = AuthCleanup;
  (window as any).clearAllAuth = clearAllAuth;
  (window as any).getTokenInfo = getTokenInfo;
}
