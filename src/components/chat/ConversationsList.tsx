'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Avatar from '@/shared/components/Avatar';
import { Input } from '@/shared/components/Input';
import { SearchIcon } from '@heroicons/react/outline';

interface Conversation {
  id: string;
  conversationId: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    type: 'USER' | 'VENDOR' | 'SUPPORT';
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-white border-r h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 w-full"
          />
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-dots"></span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full text-left p-4 hover:bg-gray-50 border-b flex items-start space-x-3 ${
                selectedConversationId === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <Avatar
                src={conversation.participant.avatar}
                alt={conversation.participant.name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 truncate">
                    {conversation.participant.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
