'use client';

import { useState, useEffect } from 'react';
import { 
  performFullHealthCheck, 
  checkApiHealth, 
  testAuthFlow, 
  testDatabase,
  type IntegrationReport,
  apiHealthChecker
} from '@/utils/apiHealthCheck';
import { authService } from '@/services/authService';
import { API_CONFIG } from '@/config/api';

interface TestState {
  loading: boolean;
  report: IntegrationReport | null;
  quickTest: { healthy: boolean; message: string } | null;
  authTest: any;
  dbTest: any;
  error: string | null;
}

export default function IntegrationTest() {
  const [state, setState] = useState<TestState>({
    loading: false,
    report: null,
    quickTest: null,
    authTest: null,
    dbTest: null,
    error: null
  });

  const [testCredentials, setTestCredentials] = useState({
    email: 'test@example.com',
    password: 'testpassword123'
  });

  // Auto-run quick health check on component mount
  useEffect(() => {
    runQuickHealthCheck();
  }, []);

  const runQuickHealthCheck = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const quickResult = await checkApiHealth();
      setState(prev => ({ 
        ...prev, 
        quickTest: quickResult,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  };

  const runFullHealthCheck = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const fullReport = await performFullHealthCheck();
      setState(prev => ({ 
        ...prev, 
        report: fullReport,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  };

  const runAuthTest = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const authResult = await testAuthFlow();
      setState(prev => ({ 
        ...prev, 
        authTest: authResult,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  };

  const runDbTest = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const dbResult = await testDatabase();
      setState(prev => ({ 
        ...prev, 
        dbTest: dbResult,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  };

  const testLogin = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('Testing login with credentials:', testCredentials.email);
      const result = await authService.login(testCredentials);
      console.log('Login test result:', result);
      alert(`Login test: ${result ? 'Success' : 'Failed'}\nUser: ${result.user?.email || 'N/A'}\nRole: ${result.user?.role || 'N/A'}`);
    } catch (error: any) {
      console.error('Login test error:', error);
      alert(`Login test failed: ${error.message}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'success': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'timeout': return 'text-orange-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'success': return '✅';
      case 'degraded': return '⚠️';
      case 'error': return '❌';
      case 'timeout': return '⏱️';
      case 'unhealthy': return '🔴';
      default: return '❓';
    }
  };

  const copyReport = () => {
    if (state.report) {
      const reportText = apiHealthChecker.generateHealthReport(state.report);
      navigator.clipboard.writeText(reportText);
      alert('Health report copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔧 ITM Frontend-Backend Integration Test
        </h1>
        <p className="text-gray-600">
          Test the connection and integration between the Next.js frontend and Spring Boot backend
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Backend URL:</strong><br />
              <code className="text-blue-700">{API_CONFIG.BASE_URL}</code>
            </div>
            <div>
              <strong>Environment:</strong><br />
              <code className="text-blue-700">{process.env.NODE_ENV || 'development'}</code>
            </div>
            <div>
              <strong>Status:</strong><br />
              {state.quickTest ? (
                <span className={state.quickTest.healthy ? 'text-green-600' : 'text-red-600'}>
                  {state.quickTest.healthy ? '✅ Connected' : '❌ Disconnected'}
                </span>
              ) : (
                <span className="text-gray-500">⏳ Checking...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Health Check */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🚀 Quick Health Check</h3>
          <button
            onClick={runQuickHealthCheck}
            disabled={state.loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
          >
            {state.loading ? 'Testing...' : 'Run Quick Test'}
          </button>
          {state.quickTest && (
            <div className="space-y-2">
              <div className={`font-medium ${getStatusColor(state.quickTest.healthy ? 'success' : 'error')}`}>
                {getStatusIcon(state.quickTest.healthy ? 'success' : 'error')} {state.quickTest.message}
              </div>
            </div>
          )}
        </div>

        {/* Authentication Test */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🔐 Authentication Test</h3>
          <button
            onClick={runAuthTest}
            disabled={state.loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mb-4"
          >
            {state.loading ? 'Testing...' : 'Test Auth Endpoints'}
          </button>
          {state.authTest && (
            <div className="space-y-2 text-sm">
              <div className={state.authTest.loginEndpoint ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(state.authTest.loginEndpoint ? 'success' : 'error')} Login API
              </div>
              <div className={state.authTest.registerEndpoint ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(state.authTest.registerEndpoint ? 'success' : 'error')} Register API
              </div>
              <div className={state.authTest.profileEndpoint ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(state.authTest.profileEndpoint ? 'success' : 'error')} Profile API
              </div>
              <p className="text-gray-600 mt-2">{state.authTest.message}</p>
            </div>
          )}
        </div>

        {/* Database Test */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🗄️ Database Test</h3>
          <button
            onClick={runDbTest}
            disabled={state.loading}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
          >
            {state.loading ? 'Testing...' : 'Test Database'}
          </button>
          {state.dbTest && (
            <div className="space-y-2 text-sm">
              <div className={state.dbTest.connected ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(state.dbTest.connected ? 'success' : 'error')} Connection
              </div>
              <div className={state.dbTest.tablesExist ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(state.dbTest.tablesExist ? 'success' : 'error')} Tables
              </div>
              <p className="text-gray-600 mt-2">{state.dbTest.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Test Section */}
      <div className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🧪 Live Login Test</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={testCredentials.email}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              value={testCredentials.password}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={testLogin}
          disabled={state.loading}
          className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {state.loading ? 'Testing Login...' : 'Test Login'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          This will test the actual login endpoint with the provided credentials
        </p>
      </div>

      {/* Full Health Check */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📋 Full Integration Health Check</h3>
          <div className="space-x-2">
            <button
              onClick={runFullHealthCheck}
              disabled={state.loading}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {state.loading ? 'Running...' : 'Run Full Check'}
            </button>
            {state.report && (
              <button
                onClick={copyReport}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                📋 Copy Report
              </button>
            )}
          </div>
        </div>

        {state.report && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Summary */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor(state.report.overall)}`}>
                    {getStatusIcon(state.report.overall)} {state.report.overall.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Overall Status</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${state.report.backendConnectivity ? 'text-green-600' : 'text-red-600'}`}>
                    {state.report.backendConnectivity ? '✅' : '❌'} 
                    {state.report.backendConnectivity ? 'Connected' : 'Disconnected'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Backend</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${state.report.databaseConnectivity ? 'text-green-600' : 'text-red-600'}`}>
                    {state.report.databaseConnectivity ? '✅' : '❌'} 
                    {state.report.databaseConnectivity ? 'Connected' : 'Disconnected'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Database</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="p-6">
              <h4 className="font-semibold mb-4">Endpoint Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.report.apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="p-3 border border-gray-100 rounded">
                    <div className="flex justify-between items-center">
                      <div className={`font-medium ${getStatusColor(endpoint.status)}`}>
                        {getStatusIcon(endpoint.status)} {endpoint.endpoint}
                      </div>
                      <div className="text-sm text-gray-500">
                        {endpoint.responseTime}ms
                        {endpoint.statusCode && ` • ${endpoint.statusCode}`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{endpoint.message}</div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {state.report.recommendations.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">💡 Recommendations</h4>
                  <ul className="space-y-2">
                    {state.report.recommendations.map((rec, index) => (
                      <li key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Report generated at: {new Date(state.report.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {state.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Running integration tests...</p>
          </div>
        </div>
      )}
    </div>
  );
}
