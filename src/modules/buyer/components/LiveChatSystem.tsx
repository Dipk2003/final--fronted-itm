'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Minimize2, Maximize2, X, MessageCircle, User, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'seller' | 'support';
  message: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  type: 'buyer' | 'seller' | 'support';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface LiveChatSystemProps {
  recipientId?: string;
  recipientType?: 'seller' | 'support';
  productId?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function LiveChatSystem({ 
  recipientId, 
  recipientType = 'support',
  productId,
  isOpen, 
  onToggle 
}: LiveChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [connecting, setConnecting] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    } else {
      disconnectChat();
    }

    return () => {
      disconnectChat();
    };
  }, [isOpen, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setConnecting(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get current user info
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser({
          id: userData.id,
          name: userData.name,
          type: 'buyer',
          isOnline: true
        });
      }

      // Load chat history if recipient is specified
      if (recipientId) {
        await loadChatHistory();
      }

      // Connect WebSocket
      connectWebSocket(token);
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Use mock data for development
      setCurrentUser({
        id: '1',
        name: 'John Buyer',
        type: 'buyer',
        isOnline: true
      });
      setIsConnected(true);
    } finally {
      setConnecting(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/history?recipientId=${recipientId}&productId=${productId || ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const history = await response.json();
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Mock chat history for development
      setMessages([
        {
          id: '1',
          senderId: 'support1',
          senderName: 'Customer Support',
          senderType: 'support',
          message: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 300000),
          status: 'delivered'
        }
      ]);
    }
  };

  const connectWebSocket = (token: string) => {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/chat';
      const ws = new WebSocket(`${wsUrl}?token=${token}&recipientId=${recipientId || ''}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (isOpen) {
            connectWebSocket(token);
          }
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      // Simulate connection for development
      setTimeout(() => {
        setIsConnected(true);
      }, 1000);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'message':
        const newMsg: ChatMessage = {
          id: data.id || Date.now().toString(),
          senderId: data.senderId,
          senderName: data.senderName,
          senderType: data.senderType,
          message: data.message,
          timestamp: new Date(data.timestamp),
          status: 'delivered'
        };
        setMessages(prev => [...prev, newMsg]);
        break;
        
      case 'typing':
        setIsTyping(data.isTyping);
        break;
        
      case 'online_users':
        setOnlineUsers(data.users);
        break;
        
      case 'message_status':
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        ));
        break;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageData: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser?.id || '1',
      senderName: currentUser?.name || 'You',
      senderType: 'buyer',
      message: newMessage.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, messageData]);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        recipientId,
        message: newMessage.trim(),
        productId
      }));
    } else {
      // Simulate sending for development
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: 'delivered' }
            : msg
        ));
      }, 1000);
    }

    setNewMessage('');
  };

  const handleTyping = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        recipientId,
        isTyping: true
      }));

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'typing',
            recipientId,
            isTyping: false
          }));
        }
      }, 2000);
    }
  };

  const disconnectChat = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline">Need Help?</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    }`}>
      {/* Chat Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm">
              {recipientType === 'support' ? 'Customer Support' : 'Seller Chat'}
            </h3>
            <p className="text-xs text-purple-200">
              {connecting ? 'Connecting...' : isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-purple-500 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-purple-500 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div className="h-72 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.senderId === currentUser?.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.senderId !== currentUser?.id && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.senderId === currentUser?.id && (
                      <div className="flex items-center gap-1">
                        {message.status === 'sending' && (
                          <Clock className="w-3 h-3 opacity-75" />
                        )}
                        {message.status === 'delivered' && (
                          <div className="w-3 h-3 border border-current rounded-full opacity-75"></div>
                        )}
                        {message.status === 'read' && (
                          <div className="w-3 h-3 bg-current rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[75%]">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={!isConnected}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {!isConnected && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Connection lost. Trying to reconnect...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}