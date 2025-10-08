'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { chatApi, ChatMessage, User } from '@/shared/services/api/chatApi';
import { 
  PaperAirplaneIcon, 
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface ChatWindowProps {
  currentUserId: number;
  partnerId: number;
  partnerName: string;
  inquiryId?: number;
  onClose?: () => void;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUserId,
  partnerId,
  partnerName,
  inquiryId,
  onClose,
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const conversation = inquiryId 
        ? await chatApi.getInquiryChat(inquiryId)
        : await chatApi.getConversation(currentUserId, partnerId);
      setMessages(conversation);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [inquiryId, currentUserId, partnerId]);

  const markAsRead = useCallback(async () => {
    try {
      await chatApi.markConversationAsRead(currentUserId, partnerId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUserId, partnerId]);

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [loadMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending) return;

    const messageData: ChatMessage = {
      senderId: currentUserId,
      receiverId: partnerId,
      message: newMessage.trim(),
      messageType: 'TEXT',
      inquiryId: inquiryId
    };

    try {
      setSending(true);
      const savedMessage = await chatApi.sendMessage(messageData);
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, currentUserId, partnerId, inquiryId]);

  const deleteMessage = useCallback(async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await chatApi.deleteMessage(messageId, currentUserId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  }, [currentUserId]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className={`w-96 h-96 ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading chat...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-96 h-96 flex flex-col ${className}`}>
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{partnerName}</CardTitle>
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-1 h-8 w-8"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg relative group ${
                  message.senderId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-75">
                    {formatTime(message.createdAt!)}
                  </span>
                  {message.senderId === currentUserId && (
                    <button
                      onClick={() => deleteMessage(message.id!)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-3"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
