/**
 * API Validation Script
 * Tests all critical API endpoints for the B2B Marketplace
 * Run with: node scripts/api-validation.js
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080/api',
  TEST_TIMEOUT: 10000, // 10 seconds
  OUTPUT_FILE: 'api-validation-report.json'
};

// Test credentials (these should be configured in environment)
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@itech.com',
    password: 'admin123',
    role: 'ADMIN'
  },
  vendor: {
    email: 'vendor@test.com',
    password: 'vendor123',
    role: 'VENDOR'
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'buyer123',
    role: 'BUYER'
  }
};

// API Endpoint Definitions
const API_ENDPOINTS = {
  // Authentication endpoints
  auth: [
    {
      name: 'User Registration',
      method: 'POST',
      endpoint: '/auth/register',
      requiresAuth: false,
      testData: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        role: 'BUYER',
        phone: '9999999999'
      }
    },
    {
      name: 'User Login',
      method: 'POST',
      endpoint: '/auth/login',
      requiresAuth: false,
      testData: TEST_CREDENTIALS.admin
    }
  ],

  // User Management
  user: [
    {
      name: 'Get User Profile',
      method: 'GET',
      endpoint: '/users/profile',
      requiresAuth: true,
      roles: ['ADMIN', 'VENDOR', 'BUYER']
    },
    {
      name: 'Update User Profile',
      method: 'PUT',
      endpoint: '/users/profile',
      requiresAuth: true,
      roles: ['ADMIN', 'VENDOR', 'BUYER'],
      testData: {
        name: 'Updated Test User',
        phone: '8888888888'
      }
    }
  ],

  // Product Management
  products: [
    {
      name: 'Get All Products',
      method: 'GET',
      endpoint: '/products',
      requiresAuth: false,
      params: { page: 0, size: 10 }
    },
    {
      name: 'Get Product by ID',
      method: 'GET',
      endpoint: '/products/1',
      requiresAuth: false
    },
    {
      name: 'Create Product (Vendor)',
      method: 'POST',
      endpoint: '/vendor/products',
      requiresAuth: true,
      roles: ['VENDOR'],
      testData: {
        name: 'Test Product',
        description: 'Test product description',
        price: 1000,
        categoryId: 1,
        stockQuantity: 50,
        minOrderQuantity: 1
      }
    },
    {
      name: 'Search Products',
      method: 'GET',
      endpoint: '/products/search',
      requiresAuth: false,
      params: { query: 'test', page: 0, size: 10 }
    }
  ],

  // Category Management
  categories: [
    {
      name: 'Get All Categories',
      method: 'GET',
      endpoint: '/categories',
      requiresAuth: false
    },
    {
      name: 'Create Category (Admin)',
      method: 'POST',
      endpoint: '/admin/categories',
      requiresAuth: true,
      roles: ['ADMIN'],
      testData: {
        name: 'Test Category',
        description: 'Test category description',
        slug: `test-category-${Date.now()}`
      }
    }
  ],

  // Order Management
  orders: [
    {
      name: 'Get User Orders',
      method: 'GET',
      endpoint: '/buyer/orders',
      requiresAuth: true,
      roles: ['BUYER']
    },
    {
      name: 'Get Vendor Orders',
      method: 'GET',
      endpoint: '/vendor/orders',
      requiresAuth: true,
      roles: ['VENDOR']
    },
    {
      name: 'Create Order',
      method: 'POST',
      endpoint: '/buyer/orders',
      requiresAuth: true,
      roles: ['BUYER'],
      testData: {
        items: [
          {
            productId: 1,
            quantity: 2,
            price: 1000
          }
        ],
        shippingAddress: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        }
      }
    }
  ],

  // Support System
  support: [
    {
      name: 'Get Support Tickets',
      method: 'GET',
      endpoint: '/support/tickets',
      requiresAuth: true,
      roles: ['ADMIN', 'VENDOR', 'BUYER']
    },
    {
      name: 'Create Support Ticket',
      method: 'POST',
      endpoint: '/support/tickets',
      requiresAuth: true,
      roles: ['VENDOR', 'BUYER'],
      testData: {
        subject: 'Test Support Ticket',
        category: 'TECHNICAL',
        message: 'This is a test support ticket.',
        priority: 'MEDIUM'
      }
    },
    {
      name: 'Chatbot Interaction',
      method: 'POST',
      endpoint: '/chatbot/support/chat',
      requiresAuth: false,
      testData: {
        message: 'Hello, I need help finding vendors',
        sessionId: `test-session-${Date.now()}`,
        userIp: '127.0.0.1'
      }
    }
  ],

  // Vendor Dashboard
  vendor: [
    {
      name: 'Get Vendor Analytics',
      method: 'GET',
      endpoint: '/vendor/analytics/dashboard',
      requiresAuth: true,
      roles: ['VENDOR']
    },
    {
      name: 'Get Vendor Products',
      method: 'GET',
      endpoint: '/vendor/products',
      requiresAuth: true,
      roles: ['VENDOR'],
      params: { page: 0, size: 10 }
    },
    {
      name: 'Get Vendor Leads',
      method: 'GET',
      endpoint: '/vendor/leads',
      requiresAuth: true,
      roles: ['VENDOR']
    }
  ],

  // Analytics
  analytics: [
    {
      name: 'Get Business Metrics (Admin)',
      method: 'GET',
      endpoint: '/analytics/business-metrics',
      requiresAuth: true,
      roles: ['ADMIN']
    },
    {
      name: 'Get Support Analytics',
      method: 'GET',
      endpoint: '/support-dashboard/analytics/dashboard',
      requiresAuth: true,
      roles: ['ADMIN']
    }
  ],

  // Data Entry (Employee)
  dataentry: [
    {
      name: 'Get All States',
      method: 'GET',
      endpoint: '/dataentry/states',
      requiresAuth: true,
      roles: ['ADMIN']
    },
    {
      name: 'Get All Cities',
      method: 'GET',
      endpoint: '/dataentry/cities',
      requiresAuth: true,
      roles: ['ADMIN']
    },
    {
      name: 'Create State',
      method: 'POST',
      endpoint: '/dataentry/states',
      requiresAuth: true,
      roles: ['ADMIN'],
      testData: {
        name: 'Test State',
        code: `TS${Date.now()}`,
        isActive: true
      }
    }
  ]
};

// Test Results Storage
let testResults = {
  summary: {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    startTime: new Date(),
    endTime: null,
    duration: 0
  },
  authentication: {},
  results: []
};

// Utility Functions
const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

const makeRequest = async (endpoint, method = 'GET', data = null, headers = {}, params = null) => {
  let url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    timeout: CONFIG.TEST_TIMEOUT
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.text();
  
  let parsedData;
  try {
    parsedData = JSON.parse(responseData);
  } catch (e) {
    parsedData = responseData;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: parsedData
  };
};

// Authentication Functions
const authenticateUser = async (credentials) => {
  try {
    log(`Authenticating user: ${credentials.email}`);
    const response = await makeRequest('/auth/login', 'POST', {
      email: credentials.email,
      password: credentials.password
    });

    if (response.status === 200 && response.data.token) {
      log(`Authentication successful for ${credentials.email}`);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user || { role: credentials.role }
      };
    } else {
      log(`Authentication failed for ${credentials.email}: ${response.statusText}`, 'ERROR');
      return {
        success: false,
        error: response.data.message || response.statusText
      };
    }
  } catch (error) {
    log(`Authentication error for ${credentials.email}: ${error.message}`, 'ERROR');
    return {
      success: false,
      error: error.message
    };
  }
};

// Test Execution Functions
const runSingleTest = async (test, authTokens) => {
  const testResult = {
    name: test.name,
    endpoint: test.endpoint,
    method: test.method,
    requiresAuth: test.requiresAuth,
    roles: test.roles || [],
    status: 'PENDING',
    response: null,
    error: null,
    executionTime: 0,
    timestamp: new Date()
  };

  try {
    const startTime = Date.now();
    log(`Running test: ${test.name}`);

    let headers = {};
    
    // Add authentication if required
    if (test.requiresAuth) {
      if (!test.roles || test.roles.length === 0) {
        // Default to admin token if no specific role required
        if (authTokens.admin) {
          headers.Authorization = `Bearer ${authTokens.admin}`;
        } else {
          testResult.status = 'SKIPPED';
          testResult.error = 'No admin authentication available';
          return testResult;
        }
      } else {
        // Use first available token from required roles
        let tokenUsed = false;
        for (const role of test.roles) {
          const roleKey = role.toLowerCase();
          if (authTokens[roleKey]) {
            headers.Authorization = `Bearer ${authTokens[roleKey]}`;
            tokenUsed = true;
            break;
          }
        }
        
        if (!tokenUsed) {
          testResult.status = 'SKIPPED';
          testResult.error = `No authentication available for roles: ${test.roles.join(', ')}`;
          return testResult;
        }
      }
    }

    // Execute the request
    const response = await makeRequest(
      test.endpoint,
      test.method,
      test.testData || null,
      headers,
      test.params || null
    );

    testResult.response = {
      status: response.status,
      statusText: response.statusText,
      data: typeof response.data === 'object' && response.data !== null 
        ? JSON.stringify(response.data).length > 1000 
          ? `${JSON.stringify(response.data).substring(0, 1000)}... [truncated]`
          : response.data
        : response.data
    };

    // Determine test status
    if (response.status >= 200 && response.status < 300) {
      testResult.status = 'PASSED';
      testResults.summary.passedTests++;
    } else if (response.status === 401 && test.requiresAuth) {
      testResult.status = 'FAILED';
      testResult.error = 'Authentication failed';
      testResults.summary.failedTests++;
    } else if (response.status === 403) {
      testResult.status = 'FAILED';
      testResult.error = 'Authorization failed - insufficient permissions';
      testResults.summary.failedTests++;
    } else if (response.status === 404) {
      testResult.status = 'FAILED';
      testResult.error = 'Endpoint not found';
      testResults.summary.failedTests++;
    } else {
      testResult.status = 'FAILED';
      testResult.error = response.data.message || response.statusText || 'Unknown error';
      testResults.summary.failedTests++;
    }

    testResult.executionTime = Date.now() - startTime;
    log(`Test completed: ${test.name} - ${testResult.status} (${testResult.executionTime}ms)`);

  } catch (error) {
    testResult.status = 'FAILED';
    testResult.error = error.message;
    testResult.executionTime = Date.now() - testResult.timestamp.getTime();
    testResults.summary.failedTests++;
    log(`Test failed: ${test.name} - ${error.message}`, 'ERROR');
  }

  return testResult;
};

const runTestSuite = async () => {
  log('Starting API Validation Test Suite');
  const startTime = Date.now();

  // Step 1: Authenticate test users
  log('Authenticating test users...');
  const authTokens = {};
  
  for (const [role, credentials] of Object.entries(TEST_CREDENTIALS)) {
    const authResult = await authenticateUser(credentials);
    testResults.authentication[role] = authResult;
    
    if (authResult.success) {
      authTokens[role] = authResult.token;
    }
  }

  // Step 2: Run all tests
  for (const [category, tests] of Object.entries(API_ENDPOINTS)) {
    log(`Running ${category} tests...`);
    
    for (const test of tests) {
      testResults.summary.totalTests++;
      const result = await runSingleTest(test, authTokens);
      result.category = category;
      testResults.results.push(result);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Step 3: Calculate final results
  testResults.summary.endTime = new Date();
  testResults.summary.duration = Date.now() - startTime;
  testResults.summary.skippedTests = testResults.summary.totalTests - 
    testResults.summary.passedTests - testResults.summary.failedTests;

  // Step 4: Save results to file
  const outputPath = path.join(__dirname, '..', CONFIG.OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));

  // Step 5: Display summary
  displaySummary();
};

const displaySummary = () => {
  console.log('\n' + '='.repeat(60));
  console.log('API VALIDATION TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.summary.totalTests}`);
  console.log(`Passed: ${testResults.summary.passedTests} ✅`);
  console.log(`Failed: ${testResults.summary.failedTests} ❌`);
  console.log(`Skipped: ${testResults.summary.skippedTests} ⏭️`);
  console.log(`Success Rate: ${((testResults.summary.passedTests / testResults.summary.totalTests) * 100).toFixed(1)}%`);
  console.log(`Duration: ${(testResults.summary.duration / 1000).toFixed(1)}s`);
  console.log(`Report saved to: ${CONFIG.OUTPUT_FILE}`);
  
  if (testResults.summary.failedTests > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.results
      .filter(r => r.status === 'FAILED')
      .forEach(r => {
        console.log(`  • ${r.category}/${r.name}: ${r.error}`);
      });
  }
  
  console.log('='.repeat(60));
};

// Main execution
if (require.main === module) {
  runTestSuite().catch(error => {
    log(`Test suite failed: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  runTestSuite,
  makeRequest,
  authenticateUser,
  CONFIG
};
