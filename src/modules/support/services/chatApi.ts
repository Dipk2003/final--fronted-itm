import { api } from '@/shared/services/api';

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  message: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface Conversation {
  id: number;
  userId: number;
  vendorId: number;
  subject: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  vendor: {
    id: number;
    companyName: string;
    contactEmail: string;
  };
  messages: ChatMessage[];
}

export interface CreateConversationDto {
  vendorId: number;
  subject: string;
  initialMessage: string;
}

export interface SendMessageDto {
  message: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl?: string;
  fileName?: string;
}

export interface ChatbotMessage {
  id: number;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  intent?: string;
  confidence?: number;
  createdAt: string;
}

export interface ChatbotSession {
  sessionId: string;
  userId?: number;
  messages: ChatbotMessage[];
  createdAt: string;
  updatedAt: string;
}

// Chat & Communication API functions
export const chatAPI = {
  // Conversation Management
  conversations: {
    // Get all user conversations
    getAll: async (page: number = 0, size: number = 20): Promise<{
      content: Conversation[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/chat/conversations', {
        params: { page, size }
      });
      return response.data;
    },

    // Create new conversation
    create: async (data: CreateConversationDto): Promise<Conversation> => {
      const response = await api.post('/api/chat/conversations', data);
      return response.data;
    },

    // Get conversation by ID
    getById: async (id: number): Promise<Conversation> => {
      const response = await api.get(`/api/chat/conversations/${id}`);
      return response.data;
    },

    // Update conversation status
    updateStatus: async (id: number, status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED'): Promise<Conversation> => {
      const response = await api.patch(`/api/chat/conversations/${id}/status`, { status });
      return response.data;
    },

    // Mark conversation as read
    markAsRead: async (id: number): Promise<void> => {
      await api.patch(`/api/chat/conversations/${id}/read`);
    },

    // Delete conversation
    delete: async (id: number): Promise<void> => {
      await api.delete(`/api/chat/conversations/${id}`);
    },

    // Get vendor conversations
    getVendorConversations: async (page: number = 0, size: number = 20): Promise<{
      content: Conversation[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/chat/conversations/vendor', {
        params: { page, size }
      });
      return response.data;
    }
  },

  // Message Management
  messages: {
    // Send message
    send: async (conversationId: number, data: SendMessageDto): Promise<ChatMessage> => {
      const response = await api.post(`/api/chat/conversations/${conversationId}/messages`, data);
      return response.data;
    },

    // Get messages for conversation
    getByConversation: async (conversationId: number, page: number = 0, size: number = 50): Promise<{
      content: ChatMessage[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get(`/api/chat/conversations/${conversationId}/messages`, {
        params: { page, size }
      });
      return response.data;
    },

    // Mark message as read
    markAsRead: async (messageId: number): Promise<void> => {
      await api.patch(`/api/chat/messages/${messageId}/read`);
    },

    // Delete message
    delete: async (messageId: number): Promise<void> => {
      await api.delete(`/api/chat/messages/${messageId}`);
    },

    // Upload file for chat
    uploadFile: async (file: File): Promise<{
      fileUrl: string;
      fileName: string;
    }> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  },

  // Real-time features (WebSocket)
  websocket: {
    // Connect to WebSocket
    connect: (userId: number, onMessage: (message: ChatMessage) => void): WebSocket | null => {
      if (typeof window === 'undefined') return null;
      
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'}/ws/chat/${userId}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      return ws;
    }
  }
};

// Chatbot API functions
export const chatbotAPI = {
  // Send message to chatbot
  sendMessage: async (message: string, sessionId?: string): Promise<{
    response: string;
    sessionId: string;
    intent?: string;
    confidence?: number;
  }> => {
    const response = await api.post('/api/chatbot/chat', {
      message,
      sessionId
    });
    return response.data;
  },

  // Get chat history
  getHistory: async (sessionId: string): Promise<ChatbotMessage[]> => {
    const response = await api.get(`/api/chatbot/history/${sessionId}`);
    return response.data;
  },

  // Create new session
  createSession: async (): Promise<{ sessionId: string }> => {
    const response = await api.post('/api/chatbot/session');
    return response.data;
  },

  // End session
  endSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/api/chatbot/session/${sessionId}`);
  }
};