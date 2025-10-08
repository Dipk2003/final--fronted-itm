'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'support' | 'customer';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface ActiveChat {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'waiting' | 'resolved';
  lastActivity: Date;
  unreadCount: number;
  tags: string[];
}

const LiveChatInterface = () => {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([
    {
      id: '1',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh@example.com',
      subject: 'Product inquiry about Electronics',
      priority: 'high',
      status: 'active',
      lastActivity: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      unreadCount: 3,
      tags: ['product', 'electronics']
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      subject: 'Order delivery issue',
      priority: 'urgent',
      status: 'waiting',
      lastActivity: new Date(Date.now() - 2 * 60000), // 2 minutes ago
      unreadCount: 5,
      tags: ['order', 'delivery']
    },
    {
      id: '3',
      customerName: 'Amit Singh',
      customerEmail: 'amit@example.com',
      subject: 'General inquiry',
      priority: 'medium',
      status: 'active',
      lastActivity: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      unreadCount: 1,
      tags: ['general']
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<ActiveChat | null>(activeChats[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Rajesh Kumar',
      senderType: 'customer',
      message: 'Hi, I need help with product specifications for laptops',
      timestamp: new Date(Date.now() - 15 * 60000),
      isRead: true
    },
    {
      id: '2',
      senderId: 'support-1',
      senderName: 'Support Agent',
      senderType: 'support',
      message: 'Hello Rajesh! I\'d be happy to help you with laptop specifications. Which specific model are you interested in?',
      timestamp: new Date(Date.now() - 12 * 60000),
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Rajesh Kumar',
      senderType: 'customer',
      message: 'I\'m looking for gaming laptops under ₹80,000. Can you recommend some options?',
      timestamp: new Date(Date.now() - 8 * 60000),
      isRead: false
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'Rajesh Kumar',
      senderType: 'customer',
      message: 'Also, what warranty options are available?',
      timestamp: new Date(Date.now() - 5 * 60000),
      isRead: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && selectedChat) {
        setShowChatList(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'support-1',
      senderName: user?.name || 'Support Agent',
      senderType: 'support',
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last activity for active chat
    setActiveChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastActivity: new Date() }
        : chat
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'waiting': return 'text-orange-600 bg-orange-50';
      case 'resolved': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const ChatListComponent = () => (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-1/3'} border-r border-gray-200 flex flex-col h-full`}>
      {/* Chat List Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Chats</h3>
            <p className="text-sm text-gray-600">{activeChats.length} conversations</p>
          </div>
          {isMobile && (
            <button
              onClick={() => setShowChatList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="flex space-x-4 mt-3">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">
              {activeChats.filter(chat => chat.status === 'active').length} Active
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600">
              {activeChats.filter(chat => chat.status === 'waiting').length} Waiting
            </span>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {activeChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => {
              setSelectedChat(chat);
              if (isMobile) setShowChatList(false);
            }}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedChat?.id === chat.id ? 'bg-indigo-50 border-indigo-200' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {chat.customerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.customerName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(chat.priority)}`}></div>
                {chat.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-700 truncate mb-2">{chat.subject}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                  {chat.status}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTime(chat.lastActivity)}
              </span>
            </div>
            
            {chat.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {chat.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
                {chat.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{chat.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            New Chat
          </button>
          <button className="flex-1 bg-white text-gray-700 py-2 px-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );

  const ChatWindowComponent = () => (
    <div className="flex-1 flex flex-col h-full">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <button
                    onClick={() => setShowChatList(true)}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                  >
                    ← Back
                  </button>
                )}
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedChat.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.customerName}</h3>
                  <p className="text-sm text-gray-600">{selectedChat.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedChat.status)}`}>
                  {selectedChat.status}
                </span>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedChat.priority)}`} title={selectedChat.priority}></div>
                
                {/* Actions Menu */}
                <div className="relative">
                  <button className="text-gray-500 hover:text-gray-700 p-1">
                    ⋯
                  </button>
                </div>
              </div>
            </div>
            
            {/* Customer Info */}
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
              <span>📧 {selectedChat.customerEmail}</span>
              <span>🕒 Last active: {formatTime(selectedChat.lastActivity)}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'support' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.senderType === 'support'
                      ? 'bg-indigo-600 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-white text-gray-900 border rounded-r-lg rounded-tl-lg'
                  } px-4 py-2 shadow-sm`}>
                    <p className="text-sm">{message.message}</p>
                    <div className={`flex items-center justify-between mt-1 text-xs ${
                      message.senderType === 'support' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.senderType === 'support' && (
                        <span>{message.isRead ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                {/* Quick Actions */}
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Attach file">
                  📎
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Emoji">
                  😊
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            
            {/* Quick Responses */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setNewMessage('Thank you for contacting us. How can I assist you today?')}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Standard greeting
              </button>
              <button
                onClick={() => setNewMessage('I\'ll check that information for you right away.')}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Checking info
              </button>
              <button
                onClick={() => setNewMessage('Is there anything else I can help you with?')}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Follow up
              </button>
            </div>
          </div>
        </>
      ) : (
        /* No Chat Selected */
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat to start messaging</h3>
            <p className="text-gray-600">Choose a conversation from the sidebar to begin helping customers</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex overflow-hidden">
      {/* Desktop Layout */}
      {!isMobile && (
        <>
          <ChatListComponent />
          <ChatWindowComponent />
        </>
      )}
      
      {/* Mobile Layout */}
      {isMobile && (
        <>
          {showChatList ? (
            <ChatListComponent />
          ) : (
            <ChatWindowComponent />
          )}
        </>
      )}
    </div>
  );
};

export default LiveChatInterface;