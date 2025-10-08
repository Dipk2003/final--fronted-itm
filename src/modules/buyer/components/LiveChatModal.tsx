import React, { useState, useEffect } from 'react';
import { liveChatAPI } from '@/lib/supportApi';
import { ChatMessage, LiveChatSession } from '@/shared/types/index';
import { Button } from '@/shared/components/Button';

interface LiveChatModalProps {
  session: LiveChatSession;
  onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ session, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadMessages = React.useCallback(async () => {
    try {
      const response = await liveChatAPI.getMessages(session.id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, [session.id]);

  useEffect(() => {
    if (session) {
      loadMessages();
    }
  }, [session, loadMessages]);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    setIsSending(true);

    try {
      const response = await liveChatAPI.sendMessage(session.id, newMessage);
      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Live Chat</h2>
          <button onClick={onClose} className="text-red-600">Close</button>
        </div>

        <div className="overflow-y-auto max-h-72 mb-4 border-t border-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-2 ${msg.senderId === session.participants?.[0] ? 'text-right' : 'text-left'}`}>
              <p className="text-sm">
                <span className="font-semibold">{msg.senderId === session.participants?.[0] ? 'You' : 'Agent'}: </span>
                {msg.message}
              </p>
              <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;

