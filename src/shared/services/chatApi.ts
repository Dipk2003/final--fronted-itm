import { api } from './api';

// Chat API types
export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  type: 'user' | 'agent' | 'system';
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participantIds: string[];
  title?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  participantIds: string[];
  title?: string;
  initialMessage?: string;
}

export interface SendMessageDto {
  message: string;
  attachments?: string[];
}

export interface ChatbotMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  sessionId: string;
}

export interface ChatbotSession {
  id: string;
  userId: string;
  messages: ChatbotMessage[];
  createdAt: string;
  endedAt?: string;
  status: 'active' | 'ended';
}

// Chat API service
export const chatAPI = {
  // Conversations
  getConversations: () => 
    api.get('/api/chat/conversations'),
    
  createConversation: (data: CreateConversationDto) => 
    api.post('/api/chat/conversations', data),
    
  getConversation: (id: string) => 
    api.get(`/api/chat/conversations/${id}`),
    
  deleteConversation: (id: string) => 
    api.delete(`/api/chat/conversations/${id}`),
    
  // Messages
  sendMessage: (conversationId: string, data: SendMessageDto) => 
    api.post(`/api/chat/conversations/${conversationId}/messages`, data),
    
  getMessages: (conversationId: string, page?: number, size?: number) => 
    api.get(`/api/chat/conversations/${conversationId}/messages`, { 
      params: { page, size } 
    }),
    
  markAsRead: (conversationId: string) => 
    api.patch(`/api/chat/conversations/${conversationId}/read`),
    
  // File uploads
  uploadAttachment: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/chat/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Chatbot API service
export const chatbotAPI = {
  // Bot interactions
  sendMessage: (message: string, sessionId?: string) => 
    api.post('/api/chatbot/message', { message, sessionId }),
    
  getSessionHistory: (sessionId: string) => 
    api.get(`/api/chatbot/sessions/${sessionId}`),
    
  createSession: () => 
    api.post('/api/chatbot/sessions'),
    
  endSession: (sessionId: string) => 
    api.delete(`/api/chatbot/sessions/${sessionId}`),
    
  // Bot configuration
  getBotConfig: () => 
    api.get('/api/chatbot/config'),
    
  updateBotConfig: (config: any) => 
    api.put('/api/chatbot/config', config),
    
  // Training and feedback
  getFeedback: () => 
    api.get('/api/chatbot/feedback'),
    
  submitFeedback: (data: { messageId: string; helpful: boolean; comment?: string }) => 
    api.post('/api/chatbot/feedback', data),
    
  // Analytics
  getBotAnalytics: (startDate?: string, endDate?: string) => 
    api.get('/api/chatbot/analytics', { params: { startDate, endDate } }),
    
  getPopularQuestions: () => 
    api.get('/api/chatbot/popular-questions'),
};

export interface ChatServices {
  chatAPI: typeof chatAPI;
  chatbotAPI: typeof chatbotAPI;
}

const chatServices: ChatServices = { chatAPI, chatbotAPI };
export default chatServices;
