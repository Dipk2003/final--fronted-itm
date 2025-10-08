import { API_CONFIG, apiRequest } from '@/config/api';

export interface Quote {
  id: number;
  vendorId: number;
  inquiryId: number;
  response: string;
  price?: number;
  currency?: string;
  quantity?: number;
  deliveryTime?: string;
  paymentTerms?: string;
  validityPeriod?: string;
  additionalNotes?: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt?: string;
  vendor?: {
    id: number;
    name: string;
    businessName: string;
    email: string;
  };
  inquiry?: {
    id: number;
    message: string;
    productName?: string;
  };
}

export interface CreateQuoteRequest {
  vendorId: number;
  inquiryId: number;
  response: string;
  price?: number;
  currency?: string;
  quantity?: number;
  deliveryTime?: string;
  paymentTerms?: string;
  validityPeriod?: string;
  additionalNotes?: string;
}

class QuoteApiService {
  
  async createQuote(data: CreateQuoteRequest): Promise<any> {
    return apiRequest('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async getAllQuotes(): Promise<Quote[]> {
    return apiRequest<Quote[]>('/api/quotes', {}, true);
  }

  async getVendorQuotes(vendorId: number): Promise<Quote[]> {
    return apiRequest<Quote[]>(`/api/quotes/vendor/${vendorId}`, {}, true);
  }

  async getQuotesForInquiry(inquiryId: number): Promise<Quote[]> {
    return apiRequest<Quote[]>(`/api/quotes/inquiry/${inquiryId}`, {}, true);
  }

  async getUserQuotes(userId: number): Promise<Quote[]> {
    return apiRequest<Quote[]>(`/api/quotes/user/${userId}`, {}, true);
  }

  async acceptQuote(quoteId: number): Promise<any> {
    return apiRequest(`/api/quotes/${quoteId}/accept`, {
      method: 'PUT',
    }, true);
  }

  async deleteQuote(quoteId: number): Promise<any> {
    return apiRequest(`/api/quotes/${quoteId}`, {
      method: 'DELETE',
    }, true);
  }
}

export const quoteApi = new QuoteApiService();
