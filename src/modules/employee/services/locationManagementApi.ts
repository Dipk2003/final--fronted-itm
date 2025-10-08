import { api } from '@/shared/services/api';
import { State, City, LocationFormData, PaginatedResponse } from '../types/employee';

// ===== STATE MANAGEMENT =====

// Get all states
export const getAllStates = async (): Promise<State[]> => {
  const response = await api.get('/api/dataentry/states');
  return response.data;
};

// Get states with pagination
export const getStatesPaginated = async (
  page = 0, 
  size = 20, 
  search?: string
): Promise<PaginatedResponse<State>> => {
  const response = await api.get('/api/dataentry/states/paginated', {
    params: { page, size, search }
  });
  return response.data;
};

// Get state by ID
export const getStateById = async (id: string): Promise<State> => {
  const response = await api.get(`/api/dataentry/states/${id}`);
  return response.data;
};

// Create new state
export const createState = async (data: LocationFormData): Promise<State> => {
  const response = await api.post('/api/dataentry/states', data);
  return response.data;
};

// Update existing state
export const updateState = async (id: string, data: LocationFormData): Promise<State> => {
  const response = await api.put(`/api/dataentry/states/${id}`, data);
  return response.data;
};

// Delete state
export const deleteState = async (id: string): Promise<void> => {
  await api.delete(`/api/dataentry/states/${id}`);
};

// Toggle state status
export const toggleStateStatus = async (id: string): Promise<State> => {
  const response = await api.patch(`/api/dataentry/states/${id}/toggle-status`);
  return response.data;
};

// ===== CITY MANAGEMENT =====

// Get all cities
export const getAllCities = async (): Promise<City[]> => {
  const response = await api.get('/api/dataentry/cities');
  return response.data;
};

// Get cities with pagination
export const getCitiesPaginated = async (
  page = 0, 
  size = 20, 
  stateId?: string,
  search?: string
): Promise<PaginatedResponse<City>> => {
  const response = await api.get('/api/dataentry/cities/paginated', {
    params: { page, size, stateId, search }
  });
  return response.data;
};

// Get cities by state ID
export const getCitiesByState = async (stateId: string): Promise<City[]> => {
  const response = await api.get(`/api/dataentry/states/${stateId}/cities`);
  return response.data;
};

// Get city by ID
export const getCityById = async (id: string): Promise<City> => {
  const response = await api.get(`/api/dataentry/cities/${id}`);
  return response.data;
};

// Create new city
export const createCity = async (data: LocationFormData): Promise<City> => {
  const response = await api.post('/api/dataentry/cities', data);
  return response.data;
};

// Update existing city
export const updateCity = async (id: string, data: LocationFormData): Promise<City> => {
  const response = await api.put(`/api/dataentry/cities/${id}`, data);
  return response.data;
};

// Delete city
export const deleteCity = async (id: string): Promise<void> => {
  await api.delete(`/api/dataentry/cities/${id}`);
};

// Toggle city status
export const toggleCityStatus = async (id: string): Promise<City> => {
  const response = await api.patch(`/api/dataentry/cities/${id}/toggle-status`);
  return response.data;
};

// ===== BULK OPERATIONS =====

// Bulk update states
export const bulkUpdateStates = async (updates: { id: string; data: Partial<LocationFormData> }[]): Promise<void> => {
  await api.patch('/api/dataentry/states/bulk-update', { updates });
};

// Bulk delete states
export const bulkDeleteStates = async (ids: string[]): Promise<void> => {
  await api.delete('/api/dataentry/states/bulk-delete', { data: { ids } });
};

// Bulk update cities
export const bulkUpdateCities = async (updates: { id: string; data: Partial<LocationFormData> }[]): Promise<void> => {
  await api.patch('/api/dataentry/cities/bulk-update', { updates });
};

// Bulk delete cities
export const bulkDeleteCities = async (ids: string[]): Promise<void> => {
  await api.delete('/api/dataentry/cities/bulk-delete', { data: { ids } });
};

// ===== SEARCH OPERATIONS =====

// Search states
export const searchStates = async (query: string): Promise<State[]> => {
  const response = await api.get('/api/dataentry/states/search', {
    params: { q: query }
  });
  return response.data;
};

// Search cities
export const searchCities = async (query: string, stateId?: string): Promise<City[]> => {
  const response = await api.get('/api/dataentry/cities/search', {
    params: { q: query, stateId }
  });
  return response.data;
};

// ===== STATISTICS =====

// Location statistics
export const getLocationStats = async (): Promise<{
  totalStates: number;
  totalCities: number;
  activeStates: number;
  activeCities: number;
  inactiveStates: number;
  inactiveCities: number;
  stateWithMostCities: { stateName: string; cityCount: number };
}> => {
  const response = await api.get('/api/dataentry/locations/stats');
  return response.data;
};

// ===== REORDER OPERATIONS =====

// Reorder states
export const reorderStates = async (stateIds: string[]): Promise<void> => {
  await api.patch('/api/dataentry/states/reorder', { stateIds });
};

// Reorder cities within a state
export const reorderCities = async (stateId: string, cityIds: string[]): Promise<void> => {
  await api.patch(`/api/dataentry/states/${stateId}/cities/reorder`, { cityIds });
};

// ===== IMPORT/EXPORT =====

// Import states from CSV/Excel
export const importStates = async (file: File): Promise<{ success: number; failed: number; errors: string[] }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/dataentry/states/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Import cities from CSV/Excel
export const importCities = async (file: File): Promise<{ success: number; failed: number; errors: string[] }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/dataentry/cities/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Export states to CSV
export const exportStates = async (): Promise<Blob> => {
  const response = await api.get('/api/dataentry/states/export', {
    responseType: 'blob'
  });
  return response.data;
};

// Export cities to CSV
export const exportCities = async (stateId?: string): Promise<Blob> => {
  const response = await api.get('/api/dataentry/cities/export', {
    params: { stateId },
    responseType: 'blob'
  });
  return response.data;
};
