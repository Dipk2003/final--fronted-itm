import axios, { AxiosResponse } from 'axios';
import { 
  Client, 
  ClientFormData, 
  ClientFilters, 
  PaginatedResponse, 
  DashboardStats,
  ClientType,
  ClientStatus 
} from '../types/legal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const clientAPI = {
  // Get all clients with pagination
  getAllClients: async (params?: PaginationParams): Promise<PaginatedResponse<Client>> => {
    const response: AxiosResponse<PaginatedResponse<Client>> = await apiClient.get('/api/clients', {
      params
    });
    return response.data;
  },

  // Get client by ID
  getClientById: async (id: string): Promise<Client> => {
    const response: AxiosResponse<Client> = await apiClient.get(`/api/clients/${id}`);
    return response.data;
  },

  // Create new client
  createClient: async (clientData: ClientFormData): Promise<Client> => {
    const response: AxiosResponse<Client> = await apiClient.post('/api/clients', clientData);
    return response.data;
  },

  // Update existing client
  updateClient: async (id: string, clientData: ClientFormData): Promise<Client> => {
    const response: AxiosResponse<Client> = await apiClient.put(`/api/clients/${id}`, clientData);
    return response.data;
  },

  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/clients/${id}`);
  },

  // Search clients
  searchClients: async (
    query: string, 
    params?: PaginationParams
  ): Promise<PaginatedResponse<Client>> => {
    const response: AxiosResponse<PaginatedResponse<Client>> = await apiClient.get('/api/clients/search', {
      params: { query, ...params }
    });
    return response.data;
  },

  // Advanced search clients
  advancedSearchClients: async (
    filters: ClientFilters, 
    params?: PaginationParams
  ): Promise<PaginatedResponse<Client>> => {
    const response: AxiosResponse<PaginatedResponse<Client>> = await apiClient.get('/api/clients/advanced-search', {
      params: { ...filters, ...params }
    });
    return response.data;
  },

  // Get recent clients
  getRecentClients: async (days: number = 30): Promise<Client[]> => {
    const response: AxiosResponse<Client[]> = await apiClient.get('/api/clients/recent', {
      params: { days }
    });
    return response.data;
  },

  // Get clients needing follow-up
  getClientsNeedingFollowUp: async (days: number = 30): Promise<Client[]> => {
    const response: AxiosResponse<Client[]> = await apiClient.get('/api/clients/follow-up', {
      params: { days }
    });
    return response.data;
  },

  // Update last contact date
  updateLastContact: async (id: string): Promise<Client> => {
    const response: AxiosResponse<Client> = await apiClient.put(`/api/clients/${id}/contact`);
    return response.data;
  },

  // Get clients by lawyer
  getClientsByLawyer: async (lawyerId: string, params?: PaginationParams): Promise<PaginatedResponse<Client>> => {
    const response: AxiosResponse<PaginatedResponse<Client>> = await apiClient.get(`/api/clients/by-lawyer/${lawyerId}`, {
      params
    });
    return response.data;
  },

  // Get client statistics by status
  getClientStatsByStatus: async (): Promise<Array<{ status: ClientStatus; count: number }>> => {
    const response = await apiClient.get('/api/clients/stats/status');
    return response.data.map((item: any) => ({
      status: item[0] as ClientStatus,
      count: item[1] as number
    }));
  },

  // Get client statistics by type
  getClientStatsByType: async (): Promise<Array<{ type: ClientType; count: number }>> => {
    const response = await apiClient.get('/api/clients/stats/type');
    return response.data.map((item: any) => ({
      type: item[0] as ClientType,
      count: item[1] as number
    }));
  },

  // Get monthly client statistics
  getMonthlyClientStats: async (months: number = 12): Promise<Array<{ year: number; month: number; count: number }>> => {
    const response = await apiClient.get('/api/clients/stats/monthly', {
      params: { months }
    });
    return response.data.map((item: any) => ({
      year: item[0] as number,
      month: item[1] as number,
      count: item[2] as number
    }));
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<any> = await apiClient.get('/api/clients/dashboard-stats');
    
    // Transform the response to match our interface
    const data = response.data;
    return {
      totalClients: data.totalClients,
      activeClients: data.activeClients,
      recentClientsCount: data.recentClientsCount,
      followUpNeeded: data.followUpNeeded,
      clientsByType: data.clientsByType?.map((item: any) => ({
        type: item[0] as ClientType,
        count: item[1] as number
      })) || [],
      clientsByStatus: data.clientsByStatus?.map((item: any) => ({
        status: item[0] as ClientStatus,
        count: item[1] as number
      })) || []
    };
  },

  // Export clients data
  exportClients: async (format: 'csv' | 'pdf' = 'csv'): Promise<Blob> => {
    const response = await apiClient.get('/api/clients/export', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Import clients from CSV
  importClients: async (file: File): Promise<{ success: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/clients/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Bulk operations
  bulkUpdateStatus: async (clientIds: string[], status: ClientStatus): Promise<void> => {
    await apiClient.put('/api/clients/bulk/status', {
      clientIds,
      status
    });
  },

  bulkDelete: async (clientIds: string[]): Promise<void> => {
    await apiClient.delete('/api/clients/bulk', {
      data: { clientIds }
    });
  },

  // Client communication history
  getClientCommunications: async (clientId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/clients/${clientId}/communications`);
    return response.data;
  },

  addClientCommunication: async (clientId: string, communication: {
    type: 'EMAIL' | 'PHONE' | 'MEETING' | 'LETTER';
    subject: string;
    content: string;
    date: string;
  }): Promise<any> => {
    const response = await apiClient.post(`/api/clients/${clientId}/communications`, communication);
    return response.data;
  }
};

export default clientAPI;
