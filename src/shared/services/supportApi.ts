import { api } from './api';

// Support API types
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedAgentId?: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
}

export interface LiveChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'ended';
  messages: ChatMessage[];
  createdAt: string;
  endedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  message: string;
  timestamp: string;
  attachments?: string[];
}

// Support API service
export const supportAPI = {
  // Ticket management
  createTicket: (data: CreateTicketData) => 
    api.post('/api/support/tickets', data),
    
  getTickets: (filters?: any) => 
    api.get('/api/support/tickets', { params: filters }),
    
  getTicket: (id: string) => 
    api.get(`/api/support/tickets/${id}`),
    
  updateTicket: (id: string, data: Partial<SupportTicket>) => 
    api.put(`/api/support/tickets/${id}`, data),
    
  closeTicket: (id: string) => 
    api.patch(`/api/support/tickets/${id}/close`),
    
  assignTicket: (id: string, agentId: string) => 
    api.patch(`/api/support/tickets/${id}/assign`, { agentId }),
    
  // Ticket comments
  addComment: (ticketId: string, comment: string) => 
    api.post(`/api/support/tickets/${ticketId}/comments`, { comment }),
    
  getComments: (ticketId: string) => 
    api.get(`/api/support/tickets/${ticketId}/comments`),
    
  // Knowledge base
  getKnowledgeBase: () => 
    api.get('/api/support/knowledge-base'),
    
  searchKnowledgeBase: (query: string) => 
    api.get('/api/support/knowledge-base/search', { params: { q: query } }),
    
  getKnowledgeBaseArticle: (id: string) => 
    api.get(`/api/support/knowledge-base/${id}`),
    
  // FAQ
  getFAQs: (category?: string) => 
    api.get('/api/support/faqs', { params: { category } }),
    
  getFAQCategories: () => 
    api.get('/api/support/faq-categories'),
    
  // Support analytics
  getTicketAnalytics: (startDate?: string, endDate?: string) => 
    api.get('/api/support/analytics/tickets', { params: { startDate, endDate } }),
    
  getAgentPerformance: (agentId?: string) => 
    api.get('/api/support/analytics/agents', { params: { agentId } }),
};

// Live Chat API service
export const liveChatAPI = {
  // Chat session management
  startSession: () => 
    api.post('/api/support/live-chat/start'),
    
  endSession: (sessionId: string) => 
    api.post(`/api/support/live-chat/${sessionId}/end`),
    
  getSession: (sessionId: string) => 
    api.get(`/api/support/live-chat/${sessionId}`),
    
  getUserSessions: () => 
    api.get('/api/support/live-chat/sessions'),
    
  // Messages
  sendMessage: (sessionId: string, message: string) => 
    api.post(`/api/support/live-chat/${sessionId}/messages`, { message }),
    
  getMessages: (sessionId: string) => 
    api.get(`/api/support/live-chat/${sessionId}/messages`),
    
  // Agent features
  getActiveChats: () => 
    api.get('/api/support/live-chat/active'),
    
  assignAgent: (sessionId: string, agentId: string) => 
    api.post(`/api/support/live-chat/${sessionId}/assign`, { agentId }),
    
  transferChat: (sessionId: string, newAgentId: string) => 
    api.post(`/api/support/live-chat/${sessionId}/transfer`, { agentId: newAgentId }),
    
  // Chat status
  setAgentStatus: (status: 'available' | 'busy' | 'offline') => 
    api.patch('/api/support/live-chat/agent/status', { status }),
    
  getAgentStatus: () => 
    api.get('/api/support/live-chat/agent/status'),
    
  // Queue management
  getWaitingQueue: () => 
    api.get('/api/support/live-chat/queue'),
    
  getQueuePosition: (sessionId: string) => 
    api.get(`/api/support/live-chat/queue/${sessionId}/position`),
};

const supportAPI_exports = { supportAPI, liveChatAPI };

export default supportAPI_exports;
