class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;
  private listeners: Map<string, Function[]> = new Map();
  private isConnecting: boolean = false;
  private userId: string | null = null;
  private userRole: string | null = null;

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Initialize the WebSocket connection
   */
  connect(userId: string, userRole: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.userId = userId;
      this.userRole = userRole;

      try {
        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'}/ws?userId=${userId}&role=${userRole}&token=${token}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('🔗 WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Send initial connection message
          this.send('CONNECT', {
            userId,
            userRole,
            timestamp: Date.now()
          });

          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          console.log('🔌 WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          this.socket = null;
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.socket.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect the WebSocket connection
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'User disconnected');
      this.socket = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Send a message through the WebSocket
   */
  send(type: string, data: any): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = {
        type,
        data,
        timestamp: Date.now(),
        userId: this.userId,
        userRole: this.userRole
      };
      
      this.socket.send(JSON.stringify(message));
      return true;
    }
    
    console.warn('WebSocket is not connected. Message not sent:', type, data);
    return false;
  }

  /**
   * Subscribe to specific message types
   */
  subscribe(eventType: string, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  /**
   * Unsubscribe from specific message types
   */
  unsubscribe(eventType: string, callback?: Function): void {
    if (!this.listeners.has(eventType)) return;

    if (callback) {
      const callbacks = this.listeners.get(eventType) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(eventType);
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Chat-specific methods
   */
  sendChatMessage(recipientId: string, message: string, chatType: 'support' | 'inquiry' = 'support'): boolean {
    return this.send('CHAT_MESSAGE', {
      recipientId,
      message,
      chatType,
      senderId: this.userId,
      senderRole: this.userRole
    });
  }

  joinChatRoom(roomId: string): boolean {
    return this.send('JOIN_CHAT_ROOM', {
      roomId,
      userId: this.userId,
      userRole: this.userRole
    });
  }

  leaveChatRoom(roomId: string): boolean {
    return this.send('LEAVE_CHAT_ROOM', {
      roomId,
      userId: this.userId
    });
  }

  /**
   * Notification methods
   */
  sendNotification(recipientId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  }): boolean {
    return this.send('NOTIFICATION', {
      recipientId,
      notification: {
        ...notification,
        senderId: this.userId,
        senderRole: this.userRole,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Lead management methods
   */
  subscribeToLeadUpdates(): boolean {
    return this.send('SUBSCRIBE_LEAD_UPDATES', {
      userId: this.userId,
      userRole: this.userRole
    });
  }

  /**
   * Order management methods
   */
  subscribeToOrderUpdates(): boolean {
    return this.send('SUBSCRIBE_ORDER_UPDATES', {
      userId: this.userId,
      userRole: this.userRole
    });
  }

  /**
   * Real-time analytics updates
   */
  subscribeToAnalytics(): boolean {
    return this.send('SUBSCRIBE_ANALYTICS', {
      userId: this.userId,
      userRole: this.userRole
    });
  }

  /**
   * System status methods
   */
  updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline'): boolean {
    return this.send('USER_STATUS_UPDATE', {
      userId: this.userId,
      status,
      timestamp: Date.now()
    });
  }

  /**
   * Private methods
   */
  private handleMessage(message: any): void {
    const { type, data } = message;
    
    // Emit to specific listeners
    const callbacks = this.listeners.get(type) || [];
    callbacks.forEach(callback => {
      try {
        callback(data, message);
      } catch (error) {
        console.error(`Error in WebSocket callback for ${type}:`, error);
      }
    });

    // Handle system messages
    switch (type) {
      case 'CHAT_MESSAGE':
        this.handleChatMessage(data);
        break;
      case 'NOTIFICATION':
        this.handleNotification(data);
        break;
      case 'LEAD_UPDATE':
        this.handleLeadUpdate(data);
        break;
      case 'ORDER_UPDATE':
        this.handleOrderUpdate(data);
        break;
      case 'ANALYTICS_UPDATE':
        this.handleAnalyticsUpdate(data);
        break;
      case 'USER_STATUS_UPDATE':
        this.handleUserStatusUpdate(data);
        break;
      case 'SYSTEM_MESSAGE':
        this.handleSystemMessage(data);
        break;
      default:
        console.log('Unhandled WebSocket message type:', type);
    }
  }

  private handleChatMessage(data: any): void {
    // Show browser notification for chat messages if page is not focused
    if (!document.hasFocus() && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${data.senderName}`, {
        body: data.message,
        icon: '/favicon.ico',
        tag: 'chat-message'
      });
    }

    // Play notification sound
    this.playNotificationSound('chat');
  }

  private handleNotification(data: any): void {
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/favicon.ico',
        tag: 'system-notification'
      });
    }

    // Play notification sound based on type
    this.playNotificationSound(data.type);
  }

  private handleLeadUpdate(data: any): void {
    console.log('Lead update received:', data);
    // This will be handled by specific components subscribing to 'LEAD_UPDATE'
  }

  private handleOrderUpdate(data: any): void {
    console.log('Order update received:', data);
    // This will be handled by specific components subscribing to 'ORDER_UPDATE'
  }

  private handleAnalyticsUpdate(data: any): void {
    console.log('Analytics update received:', data);
    // This will be handled by specific components subscribing to 'ANALYTICS_UPDATE'
  }

  private handleUserStatusUpdate(data: any): void {
    console.log('User status update:', data);
    // This will be handled by specific components subscribing to 'USER_STATUS_UPDATE'
  }

  private handleSystemMessage(data: any): void {
    console.log('System message:', data);
    
    // Handle maintenance notifications, system updates, etc.
    if (data.type === 'maintenance') {
      // Show maintenance notification
      this.showSystemAlert('System Maintenance', data.message, 'warning');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.userId && this.userRole) {
        const token = localStorage.getItem('token') || '';
        this.connect(this.userId, this.userRole, token)
          .catch(error => {
            console.error('Reconnection failed:', error);
          });
      }
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  private initializeEventListeners(): void {
    // Request notification permission on initialization
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateUserStatus('away');
      } else {
        this.updateUserStatus('online');
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.updateUserStatus('offline');
      this.disconnect();
    });
  }

  private playNotificationSound(type: string): void {
    try {
      const audio = new Audio();
      switch (type) {
        case 'chat':
          audio.src = '/sounds/chat-notification.mp3';
          break;
        case 'success':
          audio.src = '/sounds/success-notification.mp3';
          break;
        case 'error':
          audio.src = '/sounds/error-notification.mp3';
          break;
        case 'warning':
          audio.src = '/sounds/warning-notification.mp3';
          break;
        default:
          audio.src = '/sounds/default-notification.mp3';
      }
      
      audio.volume = 0.3;
      audio.play().catch(error => {
        // Ignore errors (user might not have interacted with page yet)
      });
    } catch (error) {
      // Ignore sound errors
    }
  }

  private showSystemAlert(title: string, message: string, type: 'info' | 'warning' | 'error'): void {
    // This would trigger a system-wide alert component
    // For now, just log it
    console.log(`${type.toUpperCase()}: ${title} - ${message}`);
    
    // You could dispatch a Redux action here to show a toast/alert component
    // Example: store.dispatch(showAlert({ title, message, type }));
  }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService;

// Export types for TypeScript
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  userRole?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: number;
  chatType: 'support' | 'inquiry';
  senderName?: string;
  senderRole?: string;
}

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  senderId?: string;
  senderRole?: string;
  timestamp: number;
}