'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Inquiry {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerLocation: string;
  productName: string;
  message: string;
  contactNumber: string;
  email: string;
  timestamp: Date;
  status: 'new' | 'replied' | 'viewed';
  priority: 'high' | 'medium' | 'low';
  productImage?: string;
  requirements?: string;
  quantity?: string;
  budget?: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    buyerName: 'End Scaffolding India Pvt Ltd',
    buyerCompany: 'End Scaffolding India Pvt Ltd',
    buyerLocation: 'Ghaziabad, Uttar Pradesh',
    productName: 'Plate Load Testing Services',
    message: 'Call received on 8920162561, Duration: 105 sec',
    contactNumber: '8920162561',
    email: 'contact@endscaffolding.com',
    timestamp: new Date('2024-01-15T12:30:00'),
    status: 'new',
    priority: 'high',
    requirements: 'Plate Load Testing Services - incoming',
    quantity: '1 service',
    budget: '₹25,000 - ₹50,000'
  },
  {
    id: '2',
    buyerName: 'JSP India',
    buyerCompany: 'JSP India',
    buyerLocation: 'Gurgaon, Delhi',
    productName: 'Plate Load Testing Services',
    message: 'Call attempted for Plate Load Testing Services - incoming',
    contactNumber: '9876543210',
    email: 'inquiry@jspindia.com',
    timestamp: new Date('2024-01-15T12:30:00'),
    status: 'new',
    priority: 'high',
    requirements: 'Urgent requirement for soil testing',
    quantity: '5 tests',
    budget: '₹1,00,000+'
  },
  {
    id: '3',
    buyerName: 'Skygreen Engineering Works',
    buyerCompany: 'Skygreen Engineering Works',
    buyerLocation: 'New Delhi, Delhi',
    productName: 'Project Management Consulting',
    message: 'I viewed your Catalog Page',
    contactNumber: '9123456789',
    email: 'info@skygreen.com',
    timestamp: new Date('2024-01-15T12:18:00'),
    status: 'viewed',
    priority: 'medium',
    requirements: 'Project Management Consulting services needed',
    quantity: '1 project',
    budget: '₹5,00,000 - ₹10,00,000'
  },
  {
    id: '4',
    buyerName: 'Krishan Tanwar',
    buyerCompany: 'Krishan Tanwar',
    buyerLocation: 'Faridabad, Haryana',
    productName: 'Front Building Elevation Services',
    message: 'Front Building Elevation Services, in Local',
    contactNumber: '9876501234',
    email: 'krishan@email.com',
    timestamp: new Date('2024-01-15T11:32:00'),
    status: 'new',
    priority: 'medium',
    requirements: 'Building elevation design for residential project',
    quantity: '1 building',
    budget: '₹2,00,000 - ₹5,00,000'
  },
  {
    id: '5',
    buyerName: 'Muskan Kumari',
    buyerCompany: 'Construction Co.',
    buyerLocation: 'Hazaribagh, Jharkhand',
    productName: 'Construction Services',
    message: 'I viewed your Catalog Page',
    contactNumber: '8765432109',
    email: 'muskan@construction.com',
    timestamp: new Date('2024-01-15T10:45:00'),
    status: 'replied',
    priority: 'low',
    requirements: 'General construction work inquiry',
    quantity: 'Multiple projects',
    budget: 'To be discussed'
  }
];

export default function VendorInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied' | 'viewed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesFilter = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesSearch = inquiry.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.buyerLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string, priority: string) => {
    const statusColors = {
      new: 'bg-green-100 text-green-800',
      replied: 'bg-gray-100 text-gray-800',
      viewed: 'bg-blue-100 text-blue-800'
    };

    const priorityIndicator = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {priorityIndicator} {status === 'new' ? 'Reply Now' : status.charAt(0).toUpperCase() + status.slice(1)}
        {status === 'new' && <span className="ml-1">📧</span>}
      </span>
    );
  };

  const handleInquiryClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    // Mark as viewed if it was new
    if (inquiry.status === 'new') {
      setInquiries(prev => prev.map(inq => 
        inq.id === inquiry.id ? { ...inq, status: 'viewed' as const } : inq
      ));
    }
  };

  const InquiryDetailView = ({ inquiry }: { inquiry: Inquiry }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {inquiry.buyerName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{inquiry.buyerName}</h3>
            <p className="text-sm text-gray-600">{inquiry.buyerCompany}</p>
            <p className="text-sm text-gray-500">{inquiry.buyerLocation}</p>
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(inquiry.status, inquiry.priority)}
          <p className="text-xs text-gray-500 mt-1">
            {format(inquiry.timestamp, 'dd MMM yyyy, hh:mm a')}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-medium text-gray-900 mb-2">📦 Product Interest</h4>
        <p className="text-gray-700 mb-4">{inquiry.productName}</p>

        <h4 className="font-medium text-gray-900 mb-2">💬 Message</h4>
        <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>

        {inquiry.requirements && (
          <>
            <h4 className="font-medium text-gray-900 mb-2">📋 Requirements</h4>
            <p className="text-gray-700 mb-4">{inquiry.requirements}</p>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
            <p className="text-sm font-medium text-gray-900">{inquiry.quantity || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
            <p className="text-sm font-medium text-gray-900">{inquiry.budget || 'To be discussed'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
            <p className="text-sm font-medium text-gray-900">{inquiry.contactNumber}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowReplyModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <span>💬</span>
            <span>Send Quote</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
            <span>📞</span>
            <span>Call Now</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
            <span>📧</span>
            <span>Email</span>
          </button>
          <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
            <span>💼</span>
            <span>View Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>💬</span>
              <span>Buyer Inquiries</span>
              <span className="bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {inquiries.filter(inq => inq.status === 'new').length}
              </span>
            </h2>
            <p className="text-gray-600 mt-1">Manage and respond to buyer inquiries</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">All Contacts</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                ({filteredInquiries.length})
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by name, product, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="new">New Inquiries</option>
            <option value="replied">Replied</option>
            <option value="viewed">Viewed</option>
          </select>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
            <span>📊</span>
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <span>📋</span>
            <span>Recent Inquiries</span>
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => handleInquiryClick(inquiry)}
                className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedInquiry?.id === inquiry.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                } ${inquiry.status === 'new' ? 'border-l-4 border-l-green-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {inquiry.buyerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{inquiry.buyerName}</h4>
                      <p className="text-xs text-gray-600">{inquiry.buyerLocation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(inquiry.status, inquiry.priority)}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Product:</span> {inquiry.productName}
                </p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{inquiry.message}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>📞 {inquiry.contactNumber}</span>
                  <span>{format(inquiry.timestamp, 'hh:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Detail */}
        <div>
          {selectedInquiry ? (
            <InquiryDetailView inquiry={selectedInquiry} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Inquiry</h3>
              <p className="text-gray-600">Choose an inquiry from the list to view details and respond</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Send Quote to {selectedInquiry.buyerName}</h3>
                <button 
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quote Amount (₹)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Thank you for your inquiry. Please find our quote below..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Quote
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
