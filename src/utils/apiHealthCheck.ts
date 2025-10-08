import { API_CONFIG, apiRequest } from '@/config/api';

export interface HealthCheckResult {
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  responseTime: number;
  statusCode?: number;
  message: string;
  data?: any;
}

export interface IntegrationReport {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  backendConnectivity: boolean;
  databaseConnectivity: boolean;
  apiEndpoints: HealthCheckResult[];
  recommendations: string[];
  timestamp: string;
}

/**
 * Comprehensive API Health Check Service
 */
export class ApiHealthChecker {
  private readonly TIMEOUT_MS = 10000; // 10 seconds timeout

  /**
   * Perform a comprehensive health check of all integration points
   */
  async performFullHealthCheck(): Promise<IntegrationReport> {
    console.log('🏥 Starting comprehensive API health check...');
    
    const startTime = Date.now();
    const results: HealthCheckResult[] = [];
    const recommendations: string[] = [];

    // 1. Basic backend connectivity
    const backendHealth = await this.checkEndpoint('/health', 'Backend Health');
    results.push(backendHealth);

    // 2. Actuator health (Spring Boot specific)
    const actuatorHealth = await this.checkEndpoint('/actuator/health', 'Actuator Health');
    results.push(actuatorHealth);

    // 3. Authentication endpoints
    const authHealthChecks = await this.checkAuthenticationEndpoints();
    results.push(...authHealthChecks);

    // 4. Core API endpoints
    const coreApiChecks = await this.checkCoreApiEndpoints();
    results.push(...coreApiChecks);

    // 5. Database connectivity (indirect check through API)
    const dbConnectivity = await this.checkDatabaseConnectivity();
    results.push(dbConnectivity);

    // Analyze results
    const backendConnectivity = backendHealth.status === 'success';
    const databaseConnectivity = dbConnectivity.status === 'success';
    
    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;
    const healthPercentage = (successCount / totalCount) * 100;

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthPercentage >= 90) {
      overall = 'healthy';
    } else if (healthPercentage >= 60) {
      overall = 'degraded';
      recommendations.push('Some API endpoints are not responding. Check backend logs.');
    } else {
      overall = 'unhealthy';
      recommendations.push('Multiple API endpoints are failing. Backend may be down or misconfigured.');
    }

    // Add specific recommendations
    if (!backendConnectivity) {
      recommendations.push(`Backend is not accessible at ${API_CONFIG.BASE_URL}. Verify server is running.`);
    }
    if (!databaseConnectivity) {
      recommendations.push('Database connectivity issues detected. Check MySQL connection.');
    }

    const report: IntegrationReport = {
      overall,
      backendConnectivity,
      databaseConnectivity,
      apiEndpoints: results,
      recommendations,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Health check completed:', report);
    return report;
  }

  /**
   * Quick health check for basic connectivity
   */
  async quickHealthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      const result = await this.checkEndpoint('/health', 'Quick Health Check');
      return {
        healthy: result.status === 'success',
        message: result.message
      };
    } catch (error: any) {
      return {
        healthy: false,
        message: `Backend health check failed: ${error.message}`
      };
    }
  }

  /**
   * Test authentication flow
   */
  async testAuthenticationFlow(): Promise<{
    loginEndpoint: boolean;
    registerEndpoint: boolean;
    profileEndpoint: boolean;
    message: string;
  }> {
    const results = {
      loginEndpoint: false,
      registerEndpoint: false,
      profileEndpoint: false,
      message: ''
    };

    try {
      // Test login endpoint (expect validation error, not connectivity error)
      const loginResult = await this.checkEndpoint('/auth/login', 'Login Endpoint', 'POST');
      results.loginEndpoint = loginResult.status === 'success' || (loginResult.statusCode === 400 || loginResult.statusCode === 422);

      // Test register endpoint (expect validation error, not connectivity error)
      const registerResult = await this.checkEndpoint('/auth/register', 'Register Endpoint', 'POST');
      results.registerEndpoint = registerResult.status === 'success' || (registerResult.statusCode === 400 || registerResult.statusCode === 422);

      // Test profile endpoint (expect 401 unauthorized, not connectivity error)
      const profileResult = await this.checkEndpoint('/auth/profile', 'Profile Endpoint');
      results.profileEndpoint = profileResult.status === 'success' || profileResult.statusCode === 401;

      const workingEndpoints = Object.values(results).filter(Boolean).length - 1; // Subtract 1 for the message field
      results.message = `Authentication endpoints: ${workingEndpoints}/3 working`;

      return results;
    } catch (error: any) {
      results.message = `Authentication test failed: ${error.message}`;
      return results;
    }
  }

  /**
   * Test database integration
   */
  async testDatabaseIntegration(): Promise<{ connected: boolean; tablesExist: boolean; message: string }> {
    const result = {
      connected: false,
      tablesExist: false,
      message: ''
    };

    try {
      // Check actuator health which includes database status
      const healthResult = await this.checkEndpoint('/actuator/health', 'Database Health');
      
      if (healthResult.status === 'success' && healthResult.data) {
        result.connected = true;
        
        // Check if database component is healthy
        const dbStatus = healthResult.data.components?.db?.status;
        result.tablesExist = dbStatus === 'UP';
        
        if (result.connected && result.tablesExist) {
          result.message = 'Database is connected and healthy';
        } else if (result.connected) {
          result.message = 'Database connected but may have issues';
        } else {
          result.message = 'Database connection issues detected';
        }
      } else {
        result.message = 'Unable to check database status';
      }
    } catch (error: any) {
      result.message = `Database check failed: ${error.message}`;
    }

    return result;
  }

  /**
   * Check a specific endpoint
   */
  private async checkEndpoint(
    endpoint: string, 
    name: string, 
    method: 'GET' | 'POST' = 'GET'
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const response = await apiRequest<any>(endpoint, {
        method,
        body: method === 'POST' ? JSON.stringify({}) : undefined
      }, false);

      const responseTime = Date.now() - startTime;

      return {
        endpoint: name,
        status: 'success',
        responseTime,
        statusCode: 200,
        message: `${name} is working`,
        data: response
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      // Extract status code from error if available
      const statusCode = this.extractStatusCode(error);
      
      // Determine if this is a timeout or connectivity error
      const isTimeout = responseTime > this.TIMEOUT_MS || error.message.includes('timeout');
      const isConnectivityError = error.message.includes('ECONNREFUSED') || 
                                  error.message.includes('Network Error') ||
                                  error.message.includes('fetch');

      let status: 'error' | 'timeout' = 'error';
      let message = `${name} failed: ${error.message}`;

      if (isTimeout) {
        status = 'timeout';
        message = `${name} timed out after ${responseTime}ms`;
      } else if (isConnectivityError) {
        message = `${name} - connectivity error`;
      } else if (statusCode && statusCode >= 400 && statusCode < 500) {
        // For auth endpoints, 400-499 might be expected (validation errors)
        // Keep status as 'error' but note that endpoint is reachable
        message = `${name} is reachable but returned ${statusCode}: ${error.message}`;
      }

      return {
        endpoint: name,
        status,
        responseTime,
        statusCode,
        message
      };
    }
  }

  /**
   * Check authentication-related endpoints
   */
  private async checkAuthenticationEndpoints(): Promise<HealthCheckResult[]> {
    const authEndpoints = [
      { path: '/auth/login', name: 'Login API', method: 'POST' as const },
      { path: '/auth/register', name: 'Register API', method: 'POST' as const },
      { path: '/auth/profile', name: 'Profile API', method: 'GET' as const },
      { path: '/auth/refresh', name: 'Token Refresh API', method: 'POST' as const }
    ];

    const results: HealthCheckResult[] = [];
    
    for (const endpoint of authEndpoints) {
      const result = await this.checkEndpoint(endpoint.path, endpoint.name, endpoint.method);
      results.push(result);
    }

    return results;
  }

  /**
   * Check core API endpoints
   */
  private async checkCoreApiEndpoints(): Promise<HealthCheckResult[]> {
    const coreEndpoints = [
      { path: '/api/products', name: 'Products API' },
      { path: '/api/categories', name: 'Categories API' },
      { path: '/api/users', name: 'Users API' },
      { path: '/api/vendors', name: 'Vendors API' }
    ];

    const results: HealthCheckResult[] = [];
    
    for (const endpoint of coreEndpoints) {
      const result = await this.checkEndpoint(endpoint.path, endpoint.name);
      results.push(result);
    }

    return results;
  }

  /**
   * Check database connectivity through health endpoint
   */
  private async checkDatabaseConnectivity(): Promise<HealthCheckResult> {
    return this.checkEndpoint('/actuator/health', 'Database Connectivity');
  }

  /**
   * Extract HTTP status code from error
   */
  private extractStatusCode(error: any): number | undefined {
    if (error.response?.status) {
      return error.response.status;
    }
    if (error.status) {
      return error.status;
    }
    if (error.message?.includes('status:')) {
      const match = error.message.match(/status:\s*(\d+)/);
      return match ? parseInt(match[1]) : undefined;
    }
    return undefined;
  }

  /**
   * Generate a readable health report
   */
  generateHealthReport(report: IntegrationReport): string {
    const lines = [
      '='.repeat(60),
      '🏥 ITM FRONTEND-BACKEND INTEGRATION HEALTH REPORT',
      '='.repeat(60),
      '',
      `📊 Overall Status: ${report.overall.toUpperCase()}`,
      `🔗 Backend Connectivity: ${report.backendConnectivity ? '✅ Connected' : '❌ Disconnected'}`,
      `🗄️ Database Connectivity: ${report.databaseConnectivity ? '✅ Connected' : '❌ Disconnected'}`,
      `⏰ Report Time: ${new Date(report.timestamp).toLocaleString()}`,
      '',
      '📋 ENDPOINT STATUS:',
      '-'.repeat(40)
    ];

    // Add endpoint results
    report.apiEndpoints.forEach(endpoint => {
      const statusIcon = endpoint.status === 'success' ? '✅' : 
                        endpoint.status === 'timeout' ? '⏱️' : '❌';
      const statusText = `${statusIcon} ${endpoint.endpoint.padEnd(25)} ${endpoint.responseTime}ms`;
      lines.push(statusText);
    });

    // Add recommendations
    if (report.recommendations.length > 0) {
      lines.push('');
      lines.push('💡 RECOMMENDATIONS:');
      lines.push('-'.repeat(40));
      report.recommendations.forEach(rec => {
        lines.push(`• ${rec}`);
      });
    }

    lines.push('');
    lines.push('='.repeat(60));

    return lines.join('\n');
  }
}

// Export singleton instance
export const apiHealthChecker = new ApiHealthChecker();

// Convenience functions
export const checkApiHealth = () => apiHealthChecker.quickHealthCheck();
export const performFullHealthCheck = () => apiHealthChecker.performFullHealthCheck();
export const testAuthFlow = () => apiHealthChecker.testAuthenticationFlow();
export const testDatabase = () => apiHealthChecker.testDatabaseIntegration();
