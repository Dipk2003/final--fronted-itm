'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { supportAPI, liveChatAPI } from '@/lib/supportApi';
import { SupportTicket, CreateTicketData } from '@/modules/support/services/supportApi';
import { LiveChatSession } from '@/shared/types/index';
import LiveChatModal from './LiveChatModal';
import UserTicketList from './UserTicketList';

export default function UserSupport() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatSession, setChatSession] = useState<LiveChatSession | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const supportCategories = [
    'Order Issues',
    'Payment Problems',
    'Account Settings',
    'Technical Support',
    'Product Questions',
    'Other'
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'text-green-600' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600' },
    { value: 'URGENT', label: 'Urgent', color: 'text-red-600' }
  ];

  // Disabled automatic API calls to prevent logout issues
  // useEffect(() => {
  //   if (showTickets) {
  //     loadUserTickets();
  //   }
  // }, [showTickets]);

  const loadUserTickets = async () => {
    try {
      setIsLoading(true);
      // Temporarily disabled to prevent authentication issues
      // const userTickets = await supportAPI.getUserTickets();
      // setTickets(userTickets);
      
      // Show message about feature being temporarily unavailable
      setErrorMessage('Support ticket loading is temporarily disabled for development. Feature will be available soon.');
    } catch (error) {
      console.error('Error loading tickets:', error);
      setErrorMessage('Failed to load your tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !subject || !message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const ticketData: CreateTicketData = {
        category: selectedCategory,
        subject,
        message,
        priority
      };

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Please login to create a support ticket');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/support-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(ticketData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newTicket = await response.json();
      
      setSuccessMessage(`Support ticket #${newTicket.id} has been created successfully! We will get back to you soon.`);
      setMessage('');
      setSubject('');
      setSelectedCategory('');
      setPriority('MEDIUM');
      
      // Refresh tickets if they're being shown
      if (showTickets) {
        loadUserTickets();
      }
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartLiveChat = async () => {
    try {
      // Temporarily disabled API call to prevent authentication issues
      // const session = await liveChatAPI.startChatSession();
      // setChatSession(session);
      // setShowLiveChat(true);
      
      setErrorMessage('Live chat is temporarily disabled for development. Please use other contact methods.');
    } catch (error) {
      console.error('Error starting chat session:', error);
      setErrorMessage('Failed to start live chat. Please try again.');
    }
  };

  const handleCloseLiveChat = () => {
    setShowLiveChat(false);
    setChatSession(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Customer Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Help</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">📞 Phone Support</h4>
                <p className="text-sm text-gray-600">+91 1800-123-4567</p>
                <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">📧 Email Support</h4>
                <p className="text-sm text-gray-600">support@indiatrademart.com</p>
                <p className="text-xs text-gray-500">24/7 Response</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">💬 Live Chat</h4>
                <p className="text-sm text-gray-600">Available 24/7</p>
                <Button 
                  onClick={handleStartLiveChat}
                  className="mt-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Submit a Request</h3>
            
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </div>
        </div>
        
        {/* My Tickets Section */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">My Support Tickets</h3>
            <Button 
              onClick={() => setShowTickets(!showTickets)}
              className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm"
            >
              {showTickets ? 'Hide Tickets' : 'View My Tickets'}
            </Button>
          </div>
          
          {showTickets && (
            <UserTicketList 
              tickets={tickets} 
              isLoading={isLoading} 
              onRefresh={loadUserTickets}
            />
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">How do I track my order?</h4>
              <p className="text-sm text-gray-600 mt-1">
                You can track your order by going to "My Orders" section in your dashboard.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">What is your return policy?</h4>
              <p className="text-sm text-gray-600 mt-1">
                We offer 30-day returns for most items. Check the product page for specific return policies.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">How do I change my password?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Go to your profile settings and click on "Change Password" to update your credentials.
              </p>
            </div>
          </div>
        </div>
        
        {/* Live Chat Modal */}
        {showLiveChat && chatSession && (
          <LiveChatModal 
            session={chatSession} 
            onClose={handleCloseLiveChat}
          />
        )}
      </div>
    </div>
  );
}
