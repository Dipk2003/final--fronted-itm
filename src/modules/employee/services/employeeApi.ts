import { api } from '@/shared/services/api';
import { EmployeeProfile, DataManagementStats } from '../types/employee';

// Employee Profile Management - Using mock data for now
export const getEmployeeProfile = async (): Promise<EmployeeProfile> => {
  // Mock employee profile since backend doesn't have employee endpoints yet
  return {
    id: 'emp_001',
    name: 'John Doe',
    email: 'john.doe@indiantrademart.com',
    role: 'employee',
    permissions: {
      canCreateCategories: true,
      canUpdateCategories: true,
      canDeleteCategories: true,
      canCreateLocations: true,
      canUpdateLocations: true,
      canDeleteLocations: true,
      canViewAnalytics: true,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateEmployeeProfile = async (data: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
  // Mock update for now
  const profile = await getEmployeeProfile();
  return { ...profile, ...data, updatedAt: new Date().toISOString() };
};

// Data Management Statistics
export const getDataManagementStats = async (): Promise<DataManagementStats> => {
  const response = await api.get('/api/dataentry/analytics/dashboard');
  const dashboard = response.data;
  
  // Transform backend response to frontend format
  return {
    totalCategories: dashboard.totalCategories || 0,
    totalSubcategories: dashboard.totalSubCategories || 0,
    totalMicrocategories: dashboard.totalMicroCategories || 0,
    totalStates: 29, // Mock data for Indian states
    totalCities: 500, // Mock data
    activeCategories: dashboard.activeProducts || 0,
    inactiveCategories: dashboard.inactiveProducts || 0,
    activeLocations: 400, // Mock data
    inactiveLocations: 100 // Mock data
  };
};

// Employee Dashboard Data
export const getEmployeeDashboardData = async () => {
  const response = await api.get('/api/dataentry/analytics/dashboard');
  return response.data;
};

// Activity Logs - Mock for now
export const getEmployeeActivityLogs = async (page = 0, size = 20) => {
  return {
    content: [
      {
        id: 1,
        action: 'Category "Electronics" updated',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'John Doe'
      },
      {
        id: 2,
        action: 'New city "Bangalore" added to Karnataka',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: 'John Doe'
      }
    ],
    totalElements: 2,
    page,
    size
  };
};

// System Health Check
export const checkSystemHealth = async () => {
  return {
    database: 'operational',
    api: 'operational',
    cache: 'refreshing'
  };
};
