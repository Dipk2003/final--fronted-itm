import { api } from '@/lib/api';

export interface ChatMessage {
  id?: number;
  senderId: number;
  senderName?: string;
  receiverId: number;
  receiverName?: string;
  message: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  inquiryId?: number;
  isRead?: boolean;
  createdAt?: string;
  readAt?: string;
}

export interface ChatSummary {
  unreadCount: number;
  totalChats: number;
  recentPartners: any[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}

class ChatApiService {
  // Send a message
  async sendMessage(messageData: ChatMessage): Promise<ChatMessage> {
    const response = await api.post('/api/chat/send-v2', messageData);
    return response.data.data;
  }

  // Get conversation between two users
  async getConversation(userId1: number, userId2: number): Promise<ChatMessage[]> {
    const response = await api.get(`/api/chat/conversation/${userId1}/${userId2}`);
    return response.data;
  }

  // Get paginated chat history
  async getChatHistory(userId1: number, userId2: number, page: number = 0, size: number = 20) {
    const response = await api.get(`/api/chat/history/${userId1}/${userId2}`, {
      params: { page, size }
    });
    return response.data;
  }

  // Get inquiry-specific chat
  async getInquiryChat(inquiryId: number): Promise<ChatMessage[]> {
    const response = await api.get(`/api/chat/inquiry/${inquiryId}`);
    return response.data;
  }

  // Mark conversation as read
  async markConversationAsRead(userId: number, partnerId: number): Promise<void> {
    await api.post(`/api/chat/conversation/${userId}/${partnerId}/mark-read`);
  }

  // Get unread message count
  async getUnreadCount(userId: number): Promise<number> {
    const response = await api.get(`/api/chat/unread-count/${userId}`);
    return response.data.unreadCount;
  }

  // Get chat partners
  async getChatPartners(userId: number): Promise<User[]> {
    const response = await api.get(`/api/chat/partners/${userId}`);
    return response.data;
  }

  // Get recent chats
  async getRecentChats(userId: number, limit: number = 10): Promise<ChatMessage[]> {
    const response = await api.get(`/api/chat/recent/${userId}`, {
      params: { limit }
    });
    return response.data;
  }

  // Get chat summary
  async getChatSummary(userId: number): Promise<ChatSummary> {
    const response = await api.get(`/api/chat/summary/${userId}`);
    return response.data;
  }

  // Delete a message
  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const response = await api.delete(`/api/chat/message/${messageId}`, {
      params: { userId }
    });
    return response.data.success;
  }
}

export const chatApi = new ChatApiService();
