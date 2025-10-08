import { api } from './api';

export interface ChatbotRequest {
  message: string;
  sessionId?: string;
  userId?: number;
  userRole?: string;
  userIp?: string;
}

export interface VendorRecommendation {
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorType: string;
  performanceScore: number;
  products: string[];
  categories: string[];
  reason: string;
  contactUrl: string;
  profileUrl: string;
}

export interface LeadRecommendation {
  leadId: number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  company: string;
  productInterest: string;
  urgency: string;
  leadScore: number;
  status: string;
  createdAt: string;
  reason: string;
  contactUrl: string;
  interestedCategories: string[];
  priceRange: string;
  timeline: string;
}

export interface ChatbotResponse {
  response: string;
  sessionId: string;
  recommendations?: VendorRecommendation[];
  hasRecommendations?: boolean;
  leadRecommendations?: LeadRecommendation[];
  hasLeadRecommendations?: boolean;
  responseType?: 'VENDOR_RECOMMENDATIONS' | 'LEAD_RECOMMENDATIONS' | 'GENERAL';
  userRole?: 'NON_LOGGED' | 'BUYER' | 'VENDOR' | 'ADMIN';
  requiresLogin?: boolean;
  suggestedAction?: 'LOGIN' | 'REGISTER_OR_LOGIN' | 'CONTACT_VENDOR' | 'VIEW_LEADS' | 'EXPLORE_VENDOR_DASHBOARD' | 'EXPLORE_MARKETPLACE';
}

export interface ChatbotMessage {
  id: number;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  userIp?: string;
  createdAt: string;
  updatedAt: string;
}

class ChatbotApiService {
  // Basic chat endpoint (legacy)
  async sendMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    const response = await api.post('/api/chatbot/chat', request);
    return response.data;
  }

  // Enhanced role-based chat endpoint
  async sendRoleBasedMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    const response = await api.post('/api/chatbot/support/chat', request);
    return response.data;
  }

  // Start a new chat session
  async startSession(): Promise<ChatbotResponse> {
    const response = await api.post('/api/chatbot/start-session');
    return response.data;
  }

  // Get chat history for a session
  async getChatHistory(sessionId: string): Promise<ChatbotMessage[]> {
    const response = await api.get(`/api/chatbot/history/${sessionId}`);
    return response.data;
  }

  // Check chatbot service health
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/api/chatbot/health');
    return { 
      status: response.data, 
      timestamp: new Date().toISOString() 
    };
  }

  // Helper method to prepare request with user context
  prepareRequest(message: string, sessionId?: string): ChatbotRequest {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole') || '';
    const userId = localStorage.getItem('userId');

    return {
      message: message.trim(),
      sessionId: sessionId || `web-chat-${Date.now()}`,
      userId: userId ? parseInt(userId) : undefined,
      userRole: userRole || 'NON_LOGGED',
      userIp: 'web-client'
    };
  }

  // Helper method to determine user role from localStorage
  getCurrentUserRole(): string {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    
    if (!token) return 'NON_LOGGED';
    
    switch (userRole?.toUpperCase()) {
      case 'VENDOR':
        return 'VENDOR';
      case 'BUYER':
      case 'USER':
        return 'BUYER';
      case 'ADMIN':
        return 'ADMIN';
      default:
        return 'NON_LOGGED';
    }
  }

  // Helper method to check if user is logged in
  isUserLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}

export const chatbotAPI = new ChatbotApiService();
