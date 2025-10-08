'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, ExternalLink, Phone, Mail, Star, Building, LogIn } from 'lucide-react';

// Types
interface VendorRecommendation {
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorType: string;
  performanceScore: number;
  products: string[];
  categories: string[];
  reason: string;
  contactUrl: string;
  profileUrl: string;
}

interface LeadRecommendation {
  leadId: number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  company: string;
  productInterest: string;
  urgency: string;
  leadScore: number;
  status: string;
  createdAt: string;
  reason: string;
  contactUrl: string;
  interestedCategories: string[];
  priceRange: string;
  timeline: string;
}

interface ChatbotResponse {
  response: string;
  sessionId: string;
  recommendations?: VendorRecommendation[];
  hasRecommendations?: boolean;
  leadRecommendations?: LeadRecommendation[];
  hasLeadRecommendations?: boolean;
  responseType?: 'VENDOR_RECOMMENDATIONS' | 'LEAD_RECOMMENDATIONS' | 'GENERAL';
  userRole?: 'NON_LOGGED' | 'BUYER' | 'VENDOR' | 'ADMIN';
  requiresLogin?: boolean;
  suggestedAction?: 'LOGIN' | 'REGISTER_OR_LOGIN' | 'CONTACT_VENDOR' | 'VIEW_LEADS' | 'EXPLORE_VENDOR_DASHBOARD' | 'EXPLORE_MARKETPLACE';
}

interface ChatbotRequest {
  message: string;
  sessionId?: string;
  userId?: number;
  userRole?: string;
  userIp?: string;
}

// Simple Chatbot API
const chatbotAPI = {
  prepareRequest(message: string, sessionId?: string): ChatbotRequest {
    let token: string | null = null;
    let userRole = '';
    let userId: string | null = null;
    
    if (typeof window !== 'undefined') {
      try {
        token = localStorage.getItem('authToken');
        userRole = localStorage.getItem('userRole') || '';
        userId = localStorage.getItem('userId');
      } catch (error) {
        console.warn('LocalStorage access failed:', error);
      }
    }

    return {
      message: message.trim(),
      sessionId: sessionId || `web-chat-${Date.now()}`,
      userId: userId ? parseInt(userId) : undefined,
      userRole: userRole || 'NON_LOGGED',
      userIp: 'web-client'
    };
  },

  async sendRoleBasedMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    // For now, return a mock response since backend might not be available
    // This prevents the chat from completely breaking
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      let authToken = '';
      if (typeof window !== 'undefined') {
        try {
          authToken = localStorage.getItem('authToken') || '';
        } catch (error) {
          console.warn('LocalStorage access failed for auth token:', error);
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/api/chatbot/support/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Chatbot API not available, using fallback response:', error);
      
      // Fallback response when backend is not available
      return this.getFallbackResponse(request.message, request.sessionId || 'fallback');
    }
  },

  getFallbackResponse(message: string, sessionId: string): ChatbotResponse {
    const lowerMessage = message.toLowerCase();
    
    let response = "Hello! I'm here to help you with Indian Trade Mart. What would you like to know?";
    let suggestedAction: ChatbotResponse['suggestedAction'] = undefined;
    
    // Common greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
      response = "Hello! Welcome to Indian Trade Mart. I'm here to help you with your B2B marketplace needs. How can I assist you today?";
    }
    // Orders and buying
    else if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      response = "To place an order on Indian Trade Mart:\n\n1. Browse our products by category\n2. Add items to your cart\n3. Proceed to checkout\n4. Complete payment\n\nYou'll need to be logged in to place orders.";
      suggestedAction = 'LOGIN';
    }
    // Vendor registration
    else if (lowerMessage.includes('vendor') || lowerMessage.includes('seller') || lowerMessage.includes('become')) {
      response = "To become a vendor on Indian Trade Mart:\n\n1. Register as a vendor\n2. Complete your business profile\n3. Upload required documents\n4. Start listing your products\n\nOur team will review your application within 24-48 hours.";
      suggestedAction = 'REGISTER_OR_LOGIN';
    }
    // Payments
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      response = "We accept multiple secure payment methods:\n\n• Credit/Debit Cards\n• Net Banking\n• UPI payments\n• Digital wallets\n\nAll transactions are encrypted and secure with industry-standard SSL protection.";
    }
    // Shipping
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('dispatch')) {
      response = "Shipping details:\n\n• Free shipping on orders above ₹500\n• Pan-India delivery available\n• Shipping costs vary by location and vendor\n• Estimated delivery: 3-7 business days\n\nYou can see exact shipping details on each product page.";
    }
    // Returns
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      response = "Return Policy:\n\n• Returns accepted within 7-14 days\n• Item must be in original condition\n• Contact vendor directly for returns\n• Refund processed within 5-7 business days\n\nPolicy may vary by product category.";
    }
    // Tracking
    else if (lowerMessage.includes('track') || lowerMessage.includes('tracking') || lowerMessage.includes('status')) {
      response = "To track your order:\n\n1. Login to your account\n2. Go to 'My Orders'\n3. Click on order number\n4. View tracking details\n\nYou'll receive tracking information via SMS and email once your order is shipped.";
      suggestedAction = 'LOGIN';
    }
    // Contact/Support
    else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      response = "Need help? We're here for you!\n\n📧 Email: support@indiantrademart.com\n📞 Phone: +91-XXX-XXX-XXXX\n🕒 Support Hours: 9 AM - 6 PM (Mon-Sat)\n\nYou can also create a support ticket from your dashboard.";
    }
    // Categories/Products
    else if (lowerMessage.includes('category') || lowerMessage.includes('product') || lowerMessage.includes('what')) {
      response = "Indian Trade Mart offers products across multiple categories:\n\n🏭 Industrial Equipment\n🔧 Machinery & Tools\n🏗️ Construction Materials\n⚡ Electronics & Electrical\n🚗 Automobile Parts\n🏥 Healthcare Products\n\nBrowse our complete catalog to find what you need!";
      suggestedAction = 'EXPLORE_MARKETPLACE';
    }
    // Default response for unrecognized queries
    else {
      response = "Thank you for your message! I can help you with:\n\n• Placing orders\n• Becoming a vendor\n• Payment information\n• Shipping details\n• Return policy\n• Product categories\n\nWhat would you like to know more about?";
    }
    
    return {
      response,
      sessionId,
      suggestedAction,
      userRole: 'NON_LOGGED',
      requiresLogin: ['LOGIN', 'REGISTER_OR_LOGIN'].includes(suggestedAction || ''),
      responseType: 'GENERAL'
    };
  }
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendations?: VendorRecommendation[];
  leadRecommendations?: LeadRecommendation[];
  requiresLogin?: boolean;
  suggestedAction?: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you with your B2B marketplace needs. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('🤖 Sending chatbot message:', messageText);
      
      // Prepare request using chatbotAPI helper
      const request = chatbotAPI.prepareRequest(messageText, `web-chat-${Date.now()}`);
      console.log('📝 Chatbot request:', request);
      
      // Use the enhanced role-based chat endpoint
      const chatResponse: ChatbotResponse = await chatbotAPI.sendRoleBasedMessage(request);
      console.log('✅ Chatbot response:', chatResponse);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: chatResponse.response || 'I\'m sorry, I didn\'t understand that. Can you please rephrase?',
        isUser: false,
        timestamp: new Date(),
        recommendations: chatResponse.recommendations,
        leadRecommendations: chatResponse.leadRecommendations,
        requiresLogin: chatResponse.requiresLogin,
        suggestedAction: chatResponse.suggestedAction
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('❌ Chatbot error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'How do I place an order?',
    'What are your payment options?',
    'How can I become a vendor?',
    'What is your return policy?',
    'How do I track my order?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleVendorClick = (vendorId: number) => {
    // Navigate to vendor profile
    window.open(`/vendor/profile/${vendorId}`, '_blank');
  };

  const handleVendorContact = (vendor: VendorRecommendation) => {
    // Open contact modal or navigate to contact page
    window.open(`mailto:${vendor.vendorEmail}?subject=Inquiry from iTech Marketplace`);
  };

  const handleLeadClick = (leadId: number) => {
    // Navigate to lead details (for vendors)
    window.open(`/dashboard/leads/${leadId}`, '_blank');
  };

  const handleSuggestedAction = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'REGISTER_OR_LOGIN':
        window.location.href = '/auth/user/login';
        break;
      case 'CONTACT_VENDOR':
        // Handled by individual vendor contact buttons
        break;
      case 'VIEW_LEADS':
        window.location.href = '/dashboard/vendor-panel?tab=leads';
        break;
      case 'EXPLORE_VENDOR_DASHBOARD':
        window.location.href = '/dashboard/vendor-panel';
        break;
      case 'EXPLORE_MARKETPLACE':
        window.location.href = '/products';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderVendorRecommendations = (recommendations: VendorRecommendation[]) => {
    return (
      <div className="mt-3 space-y-2 border-t pt-2">
        <p className="text-xs font-semibold text-gray-600 mb-2">📋 Recommended Vendors:</p>
        {recommendations.slice(0, 3).map((vendor) => (
          <div key={vendor.vendorId} className="bg-gray-50 border rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Building size={12} className="mr-1" />
                {vendor.vendorName}
              </h4>
              <div className="flex items-center text-yellow-500">
                <Star size={10} fill="currentColor" />
                <span className="ml-1 text-gray-600">{vendor.performanceScore?.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-2">{vendor.reason}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <Mail size={10} />
                <span className="truncate">{vendor.vendorEmail}</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {vendor.vendorType}
              </span>
            </div>
            
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleVendorClick(vendor.vendorId)}
                className="flex-1 bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 flex items-center justify-center"
              >
                <ExternalLink size={10} className="mr-1" />
                View Profile
              </button>
              <button
                onClick={() => handleVendorContact(vendor)}
                className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center justify-center"
              >
                <Mail size={10} className="mr-1" />
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeadRecommendations = (leadRecommendations: LeadRecommendation[]) => {
    return (
      <div className="mt-3 space-y-2 border-t pt-2">
        <p className="text-xs font-semibold text-gray-600 mb-2">🎯 Potential Leads:</p>
        {leadRecommendations.slice(0, 3).map((lead) => (
          <div key={lead.leadId} className="bg-blue-50 border rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{lead.leadName}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                lead.urgency === 'HIGH' ? 'bg-red-100 text-red-700' :
                lead.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {lead.urgency}
              </span>
            </div>
            
            <p className="text-gray-600 mb-1">{lead.company} • {lead.productInterest}</p>
            <p className="text-gray-500 mb-2">{lead.reason}</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">💰 {lead.priceRange}</span>
              <span className="text-gray-500">⏰ {lead.timeline}</span>
            </div>
            
            <button
              onClick={() => handleLeadClick(lead.leadId)}
              className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex items-center justify-center"
            >
              <ExternalLink size={10} className="mr-1" />
              View Lead Details
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderSuggestedAction = (action: string, requiresLogin?: boolean) => {
    const actionButtons = {
      'LOGIN': { text: 'Login to Continue', icon: LogIn, color: 'bg-blue-600 hover:bg-blue-700' },
      'REGISTER_OR_LOGIN': { text: 'Sign Up / Login', icon: LogIn, color: 'bg-green-600 hover:bg-green-700' },
      'CONTACT_VENDOR': { text: 'Contact Vendors Above', icon: Mail, color: 'bg-indigo-600 hover:bg-indigo-700' },
      'VIEW_LEADS': { text: 'View All Leads', icon: ExternalLink, color: 'bg-orange-600 hover:bg-orange-700' },
      'EXPLORE_VENDOR_DASHBOARD': { text: 'Go to Dashboard', icon: ExternalLink, color: 'bg-purple-600 hover:bg-purple-700' },
      'EXPLORE_MARKETPLACE': { text: 'Browse Products', icon: ExternalLink, color: 'bg-teal-600 hover:bg-teal-700' }
    };

    const actionConfig = actionButtons[action as keyof typeof actionButtons];
    if (!actionConfig) return null;

    const Icon = actionConfig.icon;

    return (
      <div className="mt-3 border-t pt-2">
        <button
          onClick={() => handleSuggestedAction(action)}
          className={`w-full ${actionConfig.color} text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center transition-colors`}
        >
          <Icon size={12} className="mr-1" />
          {actionConfig.text}
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full max-w-md h-[500px] bg-white border border-gray-300 rounded-t-lg shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Bot size={24} />
          <h3 className="font-semibold">Chat Support</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-sm px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {!message.isUser && (
                <div className="flex items-start space-x-2">
                  <Bot size={16} className="mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    {/* Render vendor recommendations */}
                    {message.recommendations && message.recommendations.length > 0 && 
                      renderVendorRecommendations(message.recommendations)
                    }
                    
                    {/* Render lead recommendations */}
                    {message.leadRecommendations && message.leadRecommendations.length > 0 && 
                      renderLeadRecommendations(message.leadRecommendations)
                    }
                    
                    {/* Render suggested action button */}
                    {message.suggestedAction && 
                      renderSuggestedAction(message.suggestedAction, message.requiresLogin)
                    }
                  </div>
                </div>
              )}
              
              {message.isUser && (
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <User size={16} className="mt-1 flex-shrink-0" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Bot size={16} />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t bg-gray-50 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {quickQuestions.slice(0, 3).map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Chatbot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-40"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </>
  );
}
