'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Inquiry {
  id: string;
  productName: string;
  sellerName: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'RESPONDED' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
  responses: InquiryResponse[];
}

interface InquiryResponse {
  id: string;
  message: string;
  isFromSeller: boolean;
  createdAt: Date;
}

interface InquiryTrackerProps {
  compact?: boolean;
}

export default function InquiryTracker({ compact = false }: InquiryTrackerProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiries(data.map((inquiry: any) => ({
        ...inquiry,
        createdAt: new Date(inquiry.createdAt),
        updatedAt: new Date(inquiry.updatedAt),
        responses: inquiry.responses.map((res: any) => ({
          ...res,
          createdAt: new Date(res.createdAt)
        }))
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
      console.error('Error fetching inquiries:', err);
      
      // Mock data for development
      const mockInquiries: Inquiry[] = [
        {
          id: '1',
          productName: 'Premium Cotton T-Shirts',
          sellerName: 'Fashion Hub India',
          subject: 'Bulk Order Inquiry',
          message: 'I am interested in placing a bulk order of 500 pieces. Can you provide a quote?',
          status: 'RESPONDED',
          priority: 'HIGH',
          createdAt: new Date(Date.now() - 86400000 * 2),
          updatedAt: new Date(Date.now() - 86400000),
          responses: [
            {
              id: '1-1',
              message: 'Thank you for your inquiry. We can offer a 15% discount for orders above 500 pieces.',
              isFromSeller: true,
              createdAt: new Date(Date.now() - 86400000)
            }
          ]
        },
        {
          id: '2',
          productName: 'Kitchen Utensils Set',
          sellerName: 'Kitchen Pro Solutions',
          subject: 'Product Specifications',
          message: 'Can you provide detailed specifications and material information?',
          status: 'PENDING',
          priority: 'MEDIUM',
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000),
          responses: []
        }
      ];
      setInquiries(mockInquiries);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'RESPONDED':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CLOSED':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESPONDED':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(compact ? 3 : 6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Inquiries</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchInquiries}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayInquiries = compact ? inquiries.slice(0, 3) : inquiries;

  return (
    <div className="space-y-4">
      {displayInquiries.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Inquiries Yet</h3>
          <p className="text-gray-600">Start browsing products and send inquiries to sellers.</p>
        </div>
      ) : (
        <>
          {displayInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{inquiry.subject}</h3>
                    <p className="text-sm text-gray-600">
                      Product: <span className="font-medium">{inquiry.productName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Seller: <span className="font-medium">{inquiry.sellerName}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{inquiry.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(inquiry.createdAt)}
                    </div>
                    {inquiry.responses.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {inquiry.responses.length} response{inquiry.responses.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {getStatusIcon(inquiry.status)}
                      {inquiry.status.charAt(0) + inquiry.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {compact && inquiries.length > 3 && (
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All {inquiries.length} Inquiries →
              </button>
            </div>
          )}
        </>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedInquiry.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Product: <strong>{selectedInquiry.productName}</strong></span>
                    <span>Seller: <strong>{selectedInquiry.sellerName}</strong></span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">Your Inquiry</span>
                    <span className="text-xs text-gray-500">{formatDate(selectedInquiry.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedInquiry.message}</p>
                </div>
                
                {selectedInquiry.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`rounded-lg p-4 ${
                      response.isFromSeller
                        ? 'bg-blue-50 ml-4'
                        : 'bg-green-50 mr-4'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {response.isFromSeller ? selectedInquiry.sellerName : 'You'}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(response.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusIcon(selectedInquiry.status)}
                    {selectedInquiry.status.charAt(0) + selectedInquiry.status.slice(1).toLowerCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedInquiry.priority)}`}>
                    {selectedInquiry.priority} Priority
                  </span>
                </div>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}