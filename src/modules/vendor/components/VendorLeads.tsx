'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getVendorLeads } from '@/lib/api';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  budget: string;
  status: string;
  priority: string;
  source: string;
  date: string;
  lastContact: string;
}

export default function VendorLeads() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Mock data as fallback
  const mockLeads = useMemo<Lead[]>(() => [
    {
      id: 1,
      name: 'Rajesh Kumar',
      company: 'Tech Solutions Pvt Ltd',
      email: 'rajesh@techsolutions.com',
      phone: '9876543210',
      product: 'Laptop Stands',
      quantity: 50,
      budget: '₹1,25,000',
      status: 'new',
      priority: 'high',
      source: 'website',
      date: '2024-01-15',
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      company: 'Digital Marketing Co',
      email: 'priya@digitalmarketing.com',
      phone: '9765432180',
      product: 'Wireless Mouse',
      quantity: 100,
      budget: '₹75,000',
      status: 'contacted',
      priority: 'medium',
      source: 'referral',
      date: '2024-01-14',
      lastContact: '2024-01-16'
    },
    {
      id: 3,
      name: 'Amit Patel',
      company: 'StartUp Hub',
      email: 'amit@startuphub.com',
      phone: '9654321870',
      product: 'USB Hubs',
      quantity: 25,
      budget: '₹45,000',
      status: 'qualified',
      priority: 'high',
      source: 'social_media',
      date: '2024-01-13',
      lastContact: '2024-01-17'
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      company: 'E-commerce Solutions',
      email: 'sneha@ecommerce.com',
      phone: '9543218760',
      product: 'Phone Cases',
      quantity: 200,
      budget: '₹2,00,000',
      status: 'proposal_sent',
      priority: 'high',
      source: 'email_campaign',
      date: '2024-01-12',
      lastContact: '2024-01-18'
    }
  ], []);

  // Load leads from API
  useEffect(() => {
    const loadLeads = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading leads for vendor:', user.id);
        const response = await getVendorLeads(Number(user.id));
        console.log('Leads response:', response.data);
        
        // Transform API data to match our interface
        const transformedLeads = response.data.map((lead: any, index: number) => ({
          id: lead.id || index + 1,
          name: lead.name || lead.customerName || 'Unknown',
          company: lead.company || lead.companyName || 'N/A',
          email: lead.email || lead.customerEmail || '',
          phone: lead.phone || lead.customerPhone || '',
          product: lead.product || lead.productName || lead.requirement || 'N/A',
          quantity: lead.quantity || 1,
          budget: lead.budget || lead.budgetRange || '₹0',
          status: lead.status || 'new',
          priority: lead.priority || 'medium',
          source: lead.source || lead.leadSource || 'website',
          date: lead.date || lead.createdAt || new Date().toISOString().split('T')[0],
          lastContact: lead.lastContact || lead.updatedAt || new Date().toISOString().split('T')[0]
        }));
        
        setLeads(transformedLeads);
        setError(null);
      } catch (err: any) {
        console.error('Error loading leads:', err);
        setError('Failed to load leads. Using fallback data.');
        
        // Fallback to mock data if API fails
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [user?.id, mockLeads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'proposal_sent': return 'bg-orange-100 text-orange-800';
      case 'negotiating': return 'bg-indigo-100 text-indigo-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'all') return true;
    return lead.status === activeFilter;
  });

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Calculate dynamic stats
  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    proposals: leads.filter(lead => lead.status === 'proposal_sent').length,
    won: leads.filter(lead => lead.status === 'won').length
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
            <p className="text-gray-600 mt-1">Loading your leads...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading leads...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-yellow-800">{error}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600 mt-1">Track and manage your sales leads and prospects</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ➕ Add Lead
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📊 Export Leads
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <span className="text-2xl">🆕</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
            </div>
            <span className="text-2xl">📞</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-purple-600">{stats.qualified}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Proposals</p>
              <p className="text-2xl font-bold text-orange-600">{stats.proposals}</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Won</p>
              <p className="text-2xl font-bold text-green-600">{stats.won}</p>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'contacted', 'qualified', 'proposal_sent', 'won'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Leads' : 
                 filter === 'proposal_sent' ? 'Proposals Sent' :
                 filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search leads..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedLeads.length} lead(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Send Follow-up
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                Send Proposal
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Mark as Lost
              </button>
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(filteredLeads.map(lead => lead.id));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Company</th>
                <th className="text-left py-3 px-4">Product Interest</th>
                <th className="text-left py-3 px-4">Budget</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Priority</th>
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{lead.company}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.product}</p>
                      <p className="text-xs text-gray-500">Qty: {lead.quantity}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{lead.budget}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ').charAt(0).toUpperCase() + lead.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                      {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.source.replace('_', ' ').charAt(0).toUpperCase() + lead.source.replace('_', ' ').slice(1)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Contact
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm">
                        Qualify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Pipeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🆕</span>
            </div>
            <p className="text-sm font-medium text-gray-900">New Leads</p>
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-500">₹4,50,000 potential</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📞</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Contacted</p>
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-xs text-gray-500">₹3,20,000 potential</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Qualified</p>
            <p className="text-2xl font-bold text-purple-600">15</p>
            <p className="text-xs text-gray-500">₹6,75,000 potential</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Proposals</p>
            <p className="text-2xl font-bold text-orange-600">9</p>
            <p className="text-xs text-gray-500">₹4,95,000 potential</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Won</p>
            <p className="text-2xl font-bold text-green-600">4</p>
            <p className="text-xs text-gray-500">₹2,15,000 closed</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lead Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New lead "Rajesh Kumar" added from website</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">New Lead</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Follow-up call scheduled with "Priya Sharma"</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Follow-up</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Proposal sent to "Amit Patel" for USB Hub order</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Proposal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
