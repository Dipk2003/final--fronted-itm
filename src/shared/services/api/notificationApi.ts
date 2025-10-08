import { api } from '@/lib/api';

export interface INotification {
  id: number;
  title: string;
  message: string;
  type: 'INQUIRY' | 'QUOTE' | 'QUOTE_ACCEPTED' | 'ORDER' | 'ORDER_UPDATE' | 'PAYMENT' | 'KYC_UPDATE' | 'MESSAGE' | 'SUPPORT_TICKET' | 'REVIEW' | 'SUBSCRIPTION' | 'SYSTEM';
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSummary {
  unreadCount: number;
  totalCount: number;
  unreadByType: Record<string, number>;
}

class NotificationApiService {
  // Get user notifications
  async getUserNotifications(page: number = 0, size: number = 10): Promise<{ content: INotification[]; totalElements: number; totalPages: number; hasMore?: boolean; }> {
    const response = await api.get('/api/notifications', {
      params: { page, size }
    });
    
    // Map backend response format to frontend expected format
    const data = response.data;
    return {
      content: data.notifications || [],
      totalElements: data.notifications?.length || 0,
      totalPages: data.totalPages || 1,
      hasMore: data.hasMore || false
    };
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await api.post(`/api/notifications/${notificationId}/mark-read`);
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.post('/api/notifications/mark-all-read');
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`);
  }

  // Get notification summary
  async getNotificationSummary(): Promise<NotificationSummary> {
    const response = await api.get('/api/notifications/summary');
    
    // Map backend response format to frontend expected format
    const data = response.data;
    return {
      unreadCount: data.totalUnread || 0,
      totalCount: data.totalCount || 0,
      unreadByType: data.unreadByType || {}
    };
  }
}

export const notificationApi = new NotificationApiService();
