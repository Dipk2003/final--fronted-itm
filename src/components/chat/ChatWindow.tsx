'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/shared/components/Button';
// Temporary Avatar component until shared component is available
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-500 text-sm">{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  PhotographIcon,
  EmojiHappyIcon 
} from '@heroicons/react/outline';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'PRODUCT_SHARE' | 'QUOTATION' | 'SYSTEM';
  attachmentUrl?: string;
  attachmentType?: string;
  read: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
  receiverAvatar,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Connect to WebSocket
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

        // Subscribe to personal messages
        client.subscribe(`/user/${user?.id}/queue/messages`, message => {
          const newMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, newMessage]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      },
      onStompError: error => {
        console.error('WebSocket Error:', error);
        setIsConnected(false);
      }
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user]);

  useEffect(() => {
    // Load conversation history
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/chat/messages?receiverId=${receiverId}`);
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [receiverId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      const message = {
        senderId: user?.id,
        receiverId,
        content: inputMessage.trim(),
        type: 'TEXT' as const
      };

      // Send via WebSocket
      stompClient.current?.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-96 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={receiverAvatar}
            alt={receiverName}
            size="md"
          />
          <div>
            <h3 className="font-medium text-gray-900">{receiverName}</h3>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close chat</span>
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-dots"></span>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'TEXT' && <p>{message.content}</p>}
                {message.type === 'IMAGE' && message.attachmentUrl && (
                  <Image
                    src={message.attachmentUrl}
                    alt="Shared image"
                    width={300}
                    height={300}
                    className="max-w-full w-auto h-auto rounded"
                  />
                )}
                {message.type === 'PRODUCT_SHARE' && (
                  <div className="bg-white rounded p-2 mt-1">
                    {/* Product preview card */}
                  </div>
                )}
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <PhotographIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <EmojiHappyIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
