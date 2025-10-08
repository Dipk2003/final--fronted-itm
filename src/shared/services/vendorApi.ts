import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Vendor {
  id: number;
  name: string;
  businessName?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  verified: boolean;
  vendorType: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export const vendorApi = {
  // Get all vendors by city
  getVendorsByCity: async (city: string): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors by city:', error);
      throw error;
    }
  },

  // Get verified vendors by city
  getVerifiedVendorsByCity: async (city: string): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/city/${encodeURIComponent(city)}/verified`);
      return response.data;
    } catch (error) {
      console.error('Error fetching verified vendors by city:', error);
      throw error;
    }
  },

  // Get all vendors by state
  getVendorsByState: async (state: string): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/state/${encodeURIComponent(state)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors by state:', error);
      throw error;
    }
  },

  // Get verified vendors by state
  getVerifiedVendorsByState: async (state: string): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/state/${encodeURIComponent(state)}/verified`);
      return response.data;
    } catch (error) {
      console.error('Error fetching verified vendors by state:', error);
      throw error;
    }
  },

  // Get all available cities
  getAllCities: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/cities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Get all available states
  getAllStates: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/states`);
      return response.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  },

  // Get verified vendor count by city
  getVerifiedVendorCountByCity: async (city: string): Promise<number> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/city/${encodeURIComponent(city)}/count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor count by city:', error);
      throw error;
    }
  },

  // Get vendor by ID
  getVendorById: async (id: number): Promise<Vendor> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor by ID:', error);
      throw error;
    }
  },

  // Search vendors with filters
  searchVendors: async (filters: {
    city?: string;
    state?: string;
    verified?: boolean;
    search?: string;
  }): Promise<Vendor[]> => {
    try {
      let url = `${API_BASE_URL}/api/vendors`;
      const params = new URLSearchParams();

      if (filters.city) {
        url = `${API_BASE_URL}/api/vendors/city/${encodeURIComponent(filters.city)}`;
        if (filters.verified) {
          url += '/verified';
        }
      } else if (filters.state) {
        url = `${API_BASE_URL}/api/vendors/state/${encodeURIComponent(filters.state)}`;
        if (filters.verified) {
          url += '/verified';
        }
      } else if (filters.verified) {
        url = `${API_BASE_URL}/api/vendors/verified`;
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw error;
    }
  }
};

export default vendorApi;
