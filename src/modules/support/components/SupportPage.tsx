'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Badge } from '@/shared/components';
import SupportTicketForm from './SupportTicketForm';
import { 
  QuestionMarkCircleIcon,
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'create' | 'faq'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, click on the item you want, and use the "Buy Now" button. Fill in the inquiry form with your requirements and our team will contact you within 24 hours.',
      category: 'Orders'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, UPI, credit cards, and for established business clients, we offer credit terms after verification.',
      category: 'Payment'
    },
    {
      id: '3',
      question: 'How can I track my order?',
      answer: 'Once your order is confirmed, you will receive a tracking number via email and SMS. You can use this to track your shipment on our website or the courier partner\'s website.',
      category: 'Orders'
    },
    {
      id: '4',
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer competitive bulk pricing for large orders. Please contact our sales team with your requirements for a customized quote.',
      category: 'Pricing'
    },
    {
      id: '5',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery for unused products in original packaging. Please contact our support team to initiate a return request.',
      category: 'Returns'
    },
    {
      id: '6',
      question: 'How do I become a verified vendor?',
      answer: 'To become a verified vendor, click on "Become a Seller" in the main menu, fill out the application form with your business details, and submit required documents. Our team will review and contact you within 5 business days.',
      category: 'Vendor'
    }
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'OPEN': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      'IN_PROGRESS': { color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon },
      'RESOLVED': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'CLOSED': { color: 'bg-gray-100 text-gray-800', icon: CheckCircleIcon }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{status.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM}>
        {priority}
      </Badge>
    );
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">
            We're here to help! Get support, track tickets, or find answers to common questions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TicketIcon className="h-5 w-5 inline mr-2" />
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Ticket
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <QuestionMarkCircleIcon className="h-5 w-5 inline mr-2" />
              FAQ
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your tickets...</p>
                </CardContent>
              </Card>
            ) : tickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No support tickets yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't created any support tickets. Create one if you need help.
                  </p>
                  <Button
                    onClick={() => setActiveTab('create')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {ticket.subject}
                            </h3>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Ticket #{ticket.id}</span>
                            <span>Category: {ticket.category}</span>
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <SupportTicketForm
              onSuccess={() => {
                setActiveTab('tickets');
                fetchTickets();
              }}
            />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Find quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqData.map((faq) => (
                <Card key={faq.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Can't find what you're looking for?
                </h3>
                <p className="text-indigo-700 mb-4">
                  Our support team is here to help with any questions you may have.
                </p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create Support Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.89c.56.35 1.28.35 1.84 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-2">Get help via email</p>
              <p className="text-indigo-600 font-medium">support@itm.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-2">Call us directly</p>
              <p className="text-green-600 font-medium">+91 1234567890</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600 text-sm mb-2">We're available</p>
              <p className="text-blue-600 font-medium">Mon-Fri 9AM-6PM IST</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
