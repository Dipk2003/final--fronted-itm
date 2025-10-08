import { api } from '@/shared/services/api';

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  adminId?: string;
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface CreateTicketData {
  category: string;
  subject: string;
  message: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface LiveChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

// Support Ticket API - Enhanced to match backend endpoints
export const supportAPI = {
  // Get user tickets (matches GET /api/support/tickets)
  getTickets: async (filters?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    category?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    page?: number;
    size?: number;
  }): Promise<{
    content: SupportTicket[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> => {
    const response = await api.get('/api/support/tickets', { params: filters });
    return response.data;
  },

  // Create a new support ticket (matches POST /api/support/tickets)
  createTicket: async (data: CreateTicketData): Promise<SupportTicket> => {
    const response = await api.post('/api/support/tickets', data);
    return response.data;
  },

  // Get user's tickets (legacy method for backward compatibility)
  getUserTickets: async (): Promise<SupportTicket[]> => {
    const response = await api.get('/api/support/tickets');
    return response.data.content || response.data;
  },

  // Get all tickets (admin only)
  getAllTickets: async (): Promise<SupportTicket[]> => {
    const response = await api.get('/api/support/tickets/admin');
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.get(`/api/support/tickets/${ticketId}`);
    return response.data;
  },

  // Update ticket status (admin only)
  updateTicketStatus: async (ticketId: string, status: string, adminResponse?: string): Promise<SupportTicket> => {
    const response = await api.put(`/api/support/tickets/${ticketId}/status`, {
      status,
      adminResponse
    });
    return response.data;
  },

  // Add message to ticket
  addTicketMessage: async (ticketId: string, message: string): Promise<ChatMessage> => {
    const response = await api.post(`/api/support/tickets/${ticketId}/messages`, {
      message
    });
    return response.data;
  },

  // Get ticket messages
  getTicketMessages: async (ticketId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/support/tickets/${ticketId}/messages`);
    return response.data;
  },

  // Close ticket
  closeTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.patch(`/api/support/tickets/${ticketId}/close`);
    return response.data;
  },

  // Reopen ticket
  reopenTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.patch(`/api/support/tickets/${ticketId}/reopen`);
    return response.data;
  },

  // Assign ticket (Admin only)
  assignTicket: async (ticketId: string, adminId: string): Promise<SupportTicket> => {
    const response = await api.patch(`/api/support/tickets/${ticketId}/assign`, { adminId });
    return response.data;
  },

  // Get ticket statistics
  getTicketStats: async (): Promise<{
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
  }> => {
    const response = await api.get('/api/support/tickets/stats');
    return response.data;
  }
};

// Live Chat API
export const liveChatAPI = {
  // Start a live chat session
  startChatSession: async (): Promise<LiveChatSession> => {
    const response = await api.post('/api/support/chat/start');
    return response.data;
  },

  // Get active chat sessions (admin only)
  getActiveSessions: async (): Promise<LiveChatSession[]> => {
    const response = await api.get('/api/support/chat/sessions');
    return response.data;
  },

  // Send chat message
  sendChatMessage: async (sessionId: string, message: string): Promise<ChatMessage> => {
    const response = await api.post(`/api/support/chat/${sessionId}/message`, {
      message
    });
    return response.data;
  },

  // Get chat messages
  getChatMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/support/chat/${sessionId}/messages`);
    return response.data;
  },

  // End chat session
  endChatSession: async (sessionId: string): Promise<void> => {
    await api.post(`/api/support/chat/${sessionId}/end`);
  }
};
