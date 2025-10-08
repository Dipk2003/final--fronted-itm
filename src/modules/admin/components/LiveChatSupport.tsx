'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

interface ChatSession {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  isActive: boolean;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  assignedAdminId?: number;
}

interface ChatMessage {
  id: number;
  sessionId: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: string;
  senderType: 'USER' | 'ADMIN';
}

export default function LiveChatSupport() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeSocket = useCallback(() => {
    let newSocket: Socket | null = null;
    try {
      newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('new_message', (message: ChatMessage) => {
        if (selectedSession && message.sessionId === selectedSession.id) {
          setMessages(prev => [...prev, message]);
        }
        // Update session list to show new message
        setSessions(prev => prev.map(session => 
          session.id === message.sessionId 
            ? { ...session, lastMessage: message.message, lastMessageTime: message.timestamp }
            : session
        ));
      });

      newSocket.on('new_session', (session: ChatSession) => {
        setSessions(prev => [session, ...prev]);
      });

      newSocket.on('session_ended', (sessionId: number) => {
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, isActive: false }
            : session
        ));
      });

      setSocket(newSocket);
      return newSocket;
    } catch (error) {
      console.error('Socket connection failed:', error);
      return null;
    }
  }, [selectedSession, setMessages, setSessions]);

  useEffect(() => {
    fetchChatSessions();
    const newSocket = initializeSocket();
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [initializeSocket]);

  useEffect(() => {
    if (selectedSession) {
      fetchChatMessages(selectedSession.id);
    }
  }, [selectedSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/support/chat/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSessions(response.data);
    } catch (error: any) {
      setError('Failed to fetch chat sessions: ' + error.message);
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/support/chat/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages(response.data);
    } catch (error: any) {
      setError('Failed to fetch messages: ' + error.message);
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/support/chat/${selectedSession.id}/message`,
        { message: newMessage },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Add message to local state
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      // Emit message via socket for real-time updates
      if (socket) {
        socket.emit('admin_message', {
          sessionId: selectedSession.id,
          message: response.data
        });
      }
    } catch (error: any) {
      setError('Failed to send message: ' + error.message);
      console.error('Error sending message:', error);
    }
  };

  const endChatSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/support/chat/${sessionId}/end`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update session status
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, isActive: false }
          : session
      ));
      
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }

      // Emit session ended event
      if (socket) {
        socket.emit('session_ended', sessionId);
      }
    } catch (error: any) {
      setError('Failed to end session: ' + error.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading chat sessions...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Live Chat Support</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Sessions List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-gray-500">No active chat sessions</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{session.userName}</div>
                      <div className="text-sm text-gray-500">{session.userEmail}</div>
                      {session.lastMessage && (
                        <div className="text-sm text-gray-600 mt-1 truncate">
                          {session.lastMessage}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {session.lastMessageTime && formatTime(session.lastMessageTime)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.isActive ? 'Active' : 'Ended'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="flex flex-col h-96">
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h4 className="font-semibold">{selectedSession.userName}</h4>
                  <p className="text-sm text-gray-500">{selectedSession.userEmail}</p>
                </div>
                <div className="space-x-2">
                  {selectedSession.isActive && (
                    <button
                      onClick={() => endChatSession(selectedSession.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      End Session
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'ADMIN'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="text-sm">{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.senderType === 'ADMIN' 
                          ? 'text-blue-100' 
                          : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedSession.isActive && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Select a chat session to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
