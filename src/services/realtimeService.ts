import apiClient, { PaginatedResponse, getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

// Real-time Communication Types
export interface ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  senderName: string;
  senderType: 'user' | 'vendor' | 'support' | 'admin';
  message: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  timestamp: string;
  editedAt?: string;
  replyTo?: {
    messageId: number;
    message: string;
    senderName: string;
  };
}

export interface ChatRoom {
  id: number;
  type: 'user_support' | 'user_vendor' | 'vendor_support' | 'group';
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  title?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: number;
  userId: number;
  userName: string;
  userType: 'user' | 'vendor' | 'support' | 'admin';
  isOnline: boolean;
  lastSeen?: string;
  role: 'participant' | 'moderator' | 'admin';
  joinedAt: string;
}

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  attachments: TicketAttachment[];
  responses: TicketResponse[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface TicketResponse {
  id: number;
  ticketId: number;
  responderId: number;
  responderName: string;
  responderType: 'user' | 'support' | 'admin';
  message: string;
  attachments: TicketAttachment[];
  isInternal: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'sales' | 'support' | 'partnership' | 'complaint';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  responses: ContactResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  id: number;
  contactId: number;
  responderId: number;
  responderName: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: NotificationCategory;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
}

export interface ChatbotConversation {
  id: number;
  sessionId: string;
  userId?: number;
  userType: 'guest' | 'user' | 'vendor';
  messages: ChatbotMessage[];
  context: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotMessage {
  id: number;
  conversationId: number;
  sender: 'user' | 'bot';
  message: string;
  messageType: 'text' | 'quick_reply' | 'button' | 'card';
  data?: Record<string, any>;
  intent?: string;
  confidence?: number;
  timestamp: string;
}

export type TicketCategory = 
  | 'technical'
  | 'billing'
  | 'product'
  | 'account'
  | 'general'
  | 'complaint'
  | 'feature_request';

export type TicketPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type TicketStatus = 
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'waiting_vendor'
  | 'resolved'
  | 'closed'
  | 'reopened';

export type NotificationType = 
  | 'order_update'
  | 'payment_status'
  | 'product_inquiry'
  | 'new_message'
  | 'account_update'
  | 'system_alert'
  | 'promotion'
  | 'reminder';

export type NotificationCategory = 
  | 'orders'
  | 'payments'
  | 'messages'
  | 'products'
  | 'account'
  | 'system'
  | 'marketing';

export interface WebSocketEvents {
  // Connection events
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'reconnect': () => void;
  
  // Chat events
  'new_message': (message: ChatMessage) => void;
  'message_read': (data: { chatId: number; messageId: number; userId: number }) => void;
  'user_typing': (data: { chatId: number; userId: number; userName: string; isTyping: boolean }) => void;
  'user_online': (data: { userId: number; userName: string }) => void;
  'user_offline': (data: { userId: number; userName: string }) => void;
  
  // Notification events
  'new_notification': (notification: Notification) => void;
  'notification_read': (notificationId: number) => void;
  
  // Order events
  'order_status_update': (data: { orderId: number; status: string; message: string }) => void;
  'payment_status_update': (data: { paymentId: number; orderId: number; status: string }) => void;
  
  // System events
  'system_maintenance': (data: { message: string; startTime: string; endTime: string }) => void;
  'system_alert': (data: { type: string; message: string; severity: 'info' | 'warning' | 'error' }) => void;
}

// Real-time Communication Service
class RealtimeService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;
  private eventListeners = new Map<string, Function[]>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // ===================
  // WEBSOCKET CONNECTION
  // ===================

  async connect(userId?: number, userType?: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const baseUrl = apiClient.getBaseUrl().replace('http', 'ws');
      const token = apiClient.getToken();

      this.socket = io(baseUrl, {
        auth: {
          token,
          userId,
          userType
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling']
      });

      this.setupEventListeners();
      this.startHeartbeat();

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log('✅ WebSocket connected successfully');
          toast.success('Real-time connection established!');
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error('❌ WebSocket connection error:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('❌ WebSocket connection failed:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.emit('disconnect', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.reconnect();
      }
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 WebSocket reconnected');
      this.emit('reconnect');
      toast.success('Connection restored!');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🔄 WebSocket reconnection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to reconnect. Please refresh the page.');
      }
    });

    // Chat events
    this.socket.on('new_message', (message: ChatMessage) => {
      this.emit('new_message', message);
      if (!document.hidden) {
        toast.success(`New message from ${message.senderName}`);
      }
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_online', (data) => {
      this.emit('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      this.emit('user_offline', data);
    });

    // Notification events
    this.socket.on('new_notification', (notification: Notification) => {
      this.emit('new_notification', notification);
      
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        toast.success(notification.title);
      }
    });

    this.socket.on('notification_read', (notificationId: number) => {
      this.emit('notification_read', notificationId);
    });

    // Order events
    this.socket.on('order_status_update', (data) => {
      this.emit('order_status_update', data);
      toast(`Order #${data.orderId}: ${data.message}`, { icon: 'ℹ️' });
    });

    this.socket.on('payment_status_update', (data) => {
      this.emit('payment_status_update', data);
      toast(`Payment update: ${data.status}`, { icon: 'ℹ️' });
    });

    // System events
    this.socket.on('system_maintenance', (data) => {
      this.emit('system_maintenance', data);
      toast(`System maintenance: ${data.message}`, { icon: 'ℹ️' });
    });

    this.socket.on('system_alert', (data) => {
      this.emit('system_alert', data);
      
      if (data.severity === 'error') {
        toast.error(data.message);
      } else if (data.severity === 'warning') {
        toast.error(data.message);
      } else {
        toast(data.message, { icon: 'ℹ️' });
      }
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 30000); // Ping every 30 seconds
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`🔄 Attempting reconnection... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
    }
  }

  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.eventListeners.clear();
    console.log('🔌 WebSocket disconnected manually');
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ===================
  // EVENT MANAGEMENT
  // ===================

  on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof WebSocketEvents>(event: K, ...args: Parameters<WebSocketEvents[K]>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          (listener as Function)(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // ===================
  // CHAT FUNCTIONALITY
  // ===================

  async getChatRooms(page = 0, size = 20): Promise<PaginatedResponse<ChatRoom>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/support/chat', params);
      const response = await apiClient.get<PaginatedResponse<ChatRoom>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch chat rooms: ${message}`);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
        empty: true
      };
    }
  }

  async getChatMessages(chatId: number, page = 0, size = 50): Promise<PaginatedResponse<ChatMessage>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl(`/api/support/chat/${chatId}/messages`, params);
      const response = await apiClient.get<PaginatedResponse<ChatMessage>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch messages: ${message}`);
      throw error;
    }
  }

  async sendMessage(chatId: number, message: string, messageType: 'text' | 'image' | 'file' = 'text', fileData?: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }): Promise<ChatMessage> {
    try {
      const messageData = {
        message,
        messageType,
        ...fileData
      };

      // Send via WebSocket for real-time delivery
      if (this.socket?.connected) {
        this.socket.emit('send_message', {
          chatId,
          ...messageData
        });
      }

      // Also send via REST API for persistence
      const response = await apiClient.post<ChatMessage>(
        `/api/support/chat/${chatId}/messages`,
        messageData
      );
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to send message: ${message}`);
      throw error;
    }
  }

  async markMessageAsRead(chatId: number, messageId: number): Promise<void> {
    try {
      if (this.socket?.connected) {
        this.socket.emit('mark_read', { chatId, messageId });
      }
      
      await apiClient.put(`/api/support/chat/${chatId}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }

  sendTypingIndicator(chatId: number, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  // ===================
  // SUPPORT TICKETS
  // ===================

  async getSupportTickets(filters: {
    page?: number;
    size?: number;
    status?: TicketStatus;
    category?: TicketCategory;
    priority?: TicketPriority;
    assignedTo?: number;
    userId?: number;
  } = {}): Promise<PaginatedResponse<SupportTicket>> {
    try {
      const { page = 0, size = 20, ...filterParams } = filters;
      const params = { page, size, ...filterParams };
      const url = apiClient.buildUrl('/api/support/tickets', params);
      const response = await apiClient.get<PaginatedResponse<SupportTicket>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch support tickets: ${message}`);
      throw error;
    }
  }

  async getSupportTicketById(ticketId: number): Promise<SupportTicket> {
    try {
      const response = await apiClient.get<SupportTicket>(`/api/support/tickets/${ticketId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch support ticket: ${message}`);
      throw error;
    }
  }

  async createSupportTicket(ticketData: {
    subject: string;
    description: string;
    category: TicketCategory;
    priority?: TicketPriority;
    attachments?: File[];
  }): Promise<SupportTicket> {
    try {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (ticketData.attachments && ticketData.attachments.length > 0) {
        for (const file of ticketData.attachments) {
          const uploadResponse = await apiClient.uploadFile('/api/files/upload', file);
          attachmentUrls.push(uploadResponse.url);
        }
      }

      const response = await apiClient.post<SupportTicket>('/api/support/tickets', {
        ...ticketData,
        attachmentUrls
      });
      
      toast.success('Support ticket created successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create support ticket: ${message}`);
      throw error;
    }
  }

  async updateSupportTicket(ticketId: number, updates: {
    subject?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: number;
    tags?: string[];
  }): Promise<SupportTicket> {
    try {
      const response = await apiClient.put<SupportTicket>(`/api/support/tickets/${ticketId}`, updates);
      toast.success('Support ticket updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update support ticket: ${message}`);
      throw error;
    }
  }

  async addTicketResponse(ticketId: number, message: string, attachments?: File[], isInternal = false): Promise<TicketResponse> {
    try {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const uploadResponse = await apiClient.uploadFile('/api/files/upload', file);
          attachmentUrls.push(uploadResponse.url);
        }
      }

      const response = await apiClient.post<TicketResponse>(`/api/support/tickets/${ticketId}/responses`, {
        message,
        attachmentUrls,
        isInternal
      });
      
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add response: ${message}`);
      throw error;
    }
  }

  // ===================
  // CONTACT MESSAGES
  // ===================

  async getContactMessages(filters: {
    page?: number;
    size?: number;
    status?: ContactMessage['status'];
    category?: ContactMessage['category'];
    priority?: ContactMessage['priority'];
  } = {}): Promise<PaginatedResponse<ContactMessage>> {
    try {
      const { page = 0, size = 20, ...filterParams } = filters;
      const params = { page, size, ...filterParams };
      const url = apiClient.buildUrl('/api/contact/messages', params);
      const response = await apiClient.get<PaginatedResponse<ContactMessage>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch contact messages: ${message}`);
      throw error;
    }
  }

  async createContactMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    category: ContactMessage['category'];
  }): Promise<ContactMessage> {
    try {
      const response = await apiClient.post<ContactMessage>('/api/contact/messages', messageData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to send message: ${message}`);
      throw error;
    }
  }

  async updateContactMessage(messageId: number, updates: {
    status?: ContactMessage['status'];
    priority?: ContactMessage['priority'];
    assignedTo?: number;
  }): Promise<ContactMessage> {
    try {
      const response = await apiClient.put<ContactMessage>(`/api/contact/messages/${messageId}`, updates);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update contact message: ${message}`);
      throw error;
    }
  }

  async addContactResponse(messageId: number, response: string, isInternal = false): Promise<ContactResponse> {
    try {
      const responseData = await apiClient.post<ContactResponse>(`/api/contact/messages/${messageId}/responses`, {
        message: response,
        isInternal
      });
      return responseData;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add response: ${message}`);
      throw error;
    }
  }

  // ===================
  // NOTIFICATIONS
  // ===================

  async getNotifications(filters: {
    page?: number;
    size?: number;
    isRead?: boolean;
    type?: NotificationType;
    category?: NotificationCategory;
    priority?: Notification['priority'];
  } = {}): Promise<PaginatedResponse<Notification>> {
    const { page = 0, size = 20, ...filterParams } = filters;
    try {
      const params = { page, size, ...filterParams };
      const url = apiClient.buildUrl('/api/notifications', params);
      const response = await apiClient.get<PaginatedResponse<Notification>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch notifications: ${message}`);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
        empty: true
      };
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      if (this.socket?.connected) {
        this.socket.emit('notification_read', notificationId);
      }
      
      await apiClient.put(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiClient.put('/api/notifications/read-all');
      toast.success('All notifications marked as read!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to mark notifications as read: ${message}`);
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete notification: ${message}`);
      throw error;
    }
  }

  // ===================
  // CHATBOT
  // ===================

  async sendChatbotMessage(message: string, sessionId?: string): Promise<{
    response: string;
    sessionId: string;
    suggestions?: string[];
    data?: Record<string, any>;
  }> {
    try {
      const response = await apiClient.post('/api/support/chatbot/message', {
        message,
        sessionId
      });
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Chatbot error: ${message}`);
      return {
        response: 'Sorry, I\'m experiencing technical difficulties. Please try again later.',
        sessionId: sessionId || 'error',
        suggestions: ['Contact Support', 'Try Again']
      };
    }
  }

  async getChatbotHistory(sessionId: string): Promise<ChatbotConversation> {
    try {
      const response = await apiClient.get<ChatbotConversation>(`/api/support/chatbot/history/${sessionId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch chatbot history: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  getTicketStatusColor(status: TicketStatus): string {
    const colors: Record<TicketStatus, string> = {
      open: '#3b82f6',
      in_progress: '#8b5cf6',
      waiting_customer: '#f59e0b',
      waiting_vendor: '#f59e0b',
      resolved: '#10b981',
      closed: '#6b7280',
      reopened: '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  getPriorityColor(priority: TicketPriority): string {
    const colors: Record<TicketPriority, string> = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#f97316',
      urgent: '#ef4444'
    };
    return colors[priority] || '#6b7280';
  }

  formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return time.toLocaleDateString();
  }

  // Auto-connect on service initialization
  async autoConnect(): Promise<void> {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          await this.connect(user.id, user.userType);
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// Auto-connect when service is imported
if (typeof window !== 'undefined') {
  realtimeService.autoConnect();
}

export default realtimeService;