'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, XMarkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi, INotification, NotificationSummary } from '@/shared/services/api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // Initialize STOMP WebSocket connection with error handling
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        console.log('🔌 Attempting to connect to STOMP WebSocket...');
        
        // Create STOMP client with SockJS
        const client = new Client({
          webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ws`),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            console.log('🔌 STOMP Debug:', str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        // Connection event handlers
        client.onConnect = (frame) => {
          console.log('✅ STOMP WebSocket connected successfully:', frame);
          
          // Subscribe to user-specific notifications
          client.subscribe('/user/queue/notifications', (message) => {
            try {
              const notification: INotification = JSON.parse(message.body);
              console.log('🔔 New notification received:', notification);
              setNotifications(prev => [notification, ...prev]);
              fetchNotificationSummary();
              
              // Show browser notification if permission granted
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/logo.png'
                });
              }
            } catch (error) {
              console.error('❌ Error parsing notification:', error);
            }
          });
        };
        
        client.onStompError = (frame) => {
          console.error('⚠️ STOMP connection error:', frame.headers['message']);
          console.error('Additional details:', frame.body);
        };
        
        client.onWebSocketError = (event) => {
          console.error('❌ WebSocket connection error:', event);
        };
        
        client.onDisconnect = (frame) => {
          console.log('🔌 STOMP WebSocket disconnected:', frame);
        };

        stompClientRef.current = client;
        client.activate();
      } else {
        console.log('⚠️ No auth token found, skipping WebSocket connection');
      }
    } catch (error) {
      console.error('❌ Failed to initialize STOMP WebSocket:', error);
    }

    return () => {
      if (stompClientRef.current) {
        console.log('🔌 Disconnecting STOMP WebSocket...');
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications and summary with better error handling
  const fetchNotifications = async (pageNum: number = 0) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching notifications, page:', pageNum);
      
      const response = await notificationApi.getUserNotifications(pageNum, 10);
      
      if (response && response.content && Array.isArray(response.content)) {
        if (pageNum === 0) {
          setNotifications(response.content);
        } else {
          setNotifications(prev => [...prev, ...response.content]);
        }
        
        // Use hasMore from backend if available, otherwise fallback to length check
        setHasMore(response.hasMore !== undefined ? response.hasMore : response.content.length === 10);
        setPage(pageNum);
        console.log('✅ Successfully fetched', response.content.length, 'notifications');
      } else {
        console.warn('⚠️ Invalid response format for notifications', response);
        if (pageNum === 0) {
          setNotifications([]);
        }
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch notifications:', error);
      
      // Handle specific error cases
      if (error?.response?.status === 401) {
        console.warn('⚠️ Unauthorized access to notifications');
      } else if (error?.response?.status === 500) {
        console.warn('⚠️ Server error when fetching notifications');
      } else if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
        console.warn('⚠️ Network error - backend may be offline');
      }
      
      // Set empty state on first page load error
      if (pageNum === 0) {
        setNotifications([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSummary = async () => {
    try {
      console.log('🔄 Fetching notification summary...');
      const summaryData = await notificationApi.getNotificationSummary();
      
      if (summaryData && typeof summaryData.unreadCount === 'number') {
        setSummary(summaryData);
        console.log('✅ Successfully fetched notification summary:', summaryData);
      } else {
        console.warn('⚠️ Invalid summary data format');
        setSummary({ unreadCount: 0, totalCount: 0, unreadByType: {} });
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch notification summary:', error);
      
      // Provide fallback summary
      setSummary({ unreadCount: 0, totalCount: 0, unreadByType: {} });
      
      // Handle specific error cases
      if (error?.response?.status === 401) {
        console.warn('⚠️ Unauthorized access to notification summary');
      } else if (error?.response?.status === 500) {
        console.warn('⚠️ Server error when fetching notification summary');
      } else if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
        console.warn('⚠️ Network error - backend may be offline');
      }
    }
  };

  // Load initial data safely
  useEffect(() => {
    // Only attempt to load data if we're in the browser and have a token
    if (typeof window !== 'undefined') {
      const hasToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (hasToken) {
        console.log('🔄 Loading initial notification data...');
        fetchNotifications();
        fetchNotificationSummary();
      } else {
        console.log('⚠️ No auth token found, skipping notification data load');
        // Set empty state for unauthenticated users
        setNotifications([]);
        setSummary({ unreadCount: 0, totalCount: 0, unreadByType: {} });
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      fetchNotificationSummary();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      fetchNotificationSummary();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      fetchNotificationSummary();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const getNotificationIcon = (type: INotification['type']) => {
    const iconClasses = "w-4 h-4";
    
    switch (type) {
      case 'INQUIRY':
        return <span className={`${iconClasses} text-blue-500`}>📨</span>;
      case 'QUOTE':
      case 'QUOTE_ACCEPTED':
        return <span className={`${iconClasses} text-green-500`}>💰</span>;
      case 'ORDER':
      case 'ORDER_UPDATE':
        return <span className={`${iconClasses} text-purple-500`}>📦</span>;
      case 'PAYMENT':
        return <span className={`${iconClasses} text-green-600`}>💳</span>;
      case 'KYC_UPDATE':
        return <span className={`${iconClasses} text-orange-500`}>🆔</span>;
      case 'MESSAGE':
        return <span className={`${iconClasses} text-blue-600`}>💬</span>;
      case 'SUPPORT_TICKET':
        return <span className={`${iconClasses} text-red-500`}>🎫</span>;
      case 'REVIEW':
        return <span className={`${iconClasses} text-yellow-500`}>⭐</span>;
      case 'SUBSCRIPTION':
        return <span className={`${iconClasses} text-indigo-500`}>🔔</span>;
      case 'SYSTEM':
        return <span className={`${iconClasses} text-gray-500`}>⚙️</span>;
      default:
        return <span className={`${iconClasses} text-gray-500`}>🔔</span>;
    }
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {summary && summary.unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {summary.unreadCount > 99 ? '99+' : summary.unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {summary && summary.unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Notification Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Mark as read"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete notification"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="p-4 text-center">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {summary && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{summary.unreadCount} unread</span>
                  <span>{summary.totalCount} total</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
