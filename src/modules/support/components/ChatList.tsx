'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Badge } from '@/shared/components';
import { chatApi } from '@/shared/services/api/chatApi';
import { User, ChatSummary } from '@/shared/services/api/chatApi';
import { ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import ChatWindow from './ChatWindow';

interface ChatListProps {
  currentUserId: number;
  currentUserName: string;
}

const ChatList: React.FC<ChatListProps> = ({ currentUserId, currentUserName }) => {
  const [chatPartners, setChatPartners] = useState<User[]>([]);
  const [chatSummary, setChatSummary] = useState<ChatSummary | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadChatData = useCallback(async () => {
    try {
      setLoading(true);
      const [partners, summary] = await Promise.all([
        chatApi.getChatPartners(currentUserId),
        chatApi.getChatSummary(currentUserId)
      ]);
      setChatPartners(partners);
      setChatSummary(summary);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);

  const handlePartnerSelect = useCallback((partner: User) => {
    setSelectedPartner(partner);
  }, []);

  const handleCloseChatWindow = useCallback(() => {
    setSelectedPartner(null);
    // Refresh chat data after closing chat window
    loadChatData();
  }, [loadChatData]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">Loading chats...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex space-x-6">
      {/* Chat List */}
      <Card className="w-80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>Messages</span>
            </CardTitle>
            {chatSummary && chatSummary.unreadCount > 0 && (
              <Badge variant="destructive">
                {chatSummary.unreadCount} unread
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {chatPartners.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a conversation by sending an inquiry</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatPartners.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerSelect(partner)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPartner?.id === partner.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{partner.name}</h4>
                      <p className="text-sm text-gray-500">{partner.email}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {/* You could add last message time here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Window */}
      {selectedPartner && (
        <ChatWindow
          currentUserId={currentUserId}
          partnerId={selectedPartner.id}
          partnerName={selectedPartner.name}
          onClose={handleCloseChatWindow}
        />
      )}
    </div>
  );
};

export default ChatList;
