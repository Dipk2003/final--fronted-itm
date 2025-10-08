'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Badge } from '@/shared/components';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface TicketUpdate {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  response?: string;
}

const TicketManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'OPEN', label: 'Open', color: 'bg-blue-100 text-blue-800' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priority' },
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/support-tickets`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load tickets');
      }
      
      const ticketsData = await response.json();
      setTickets(ticketsData);
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      setErrorMessage('Failed to load support tickets. Please check backend connection.');
      setTickets([]); // Don't show mock data - force real backend connection
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (ticketId: string, updates: TicketUpdate) => {
    try {
      setIsUpdating(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/support-tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }
      
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      ));
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
      
      setSuccessMessage('Ticket updated successfully!');
      setResponse('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      setErrorMessage('Failed to update ticket. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || ticket.priority === filterPriority;
    const matchesSearch = searchTerm === '' || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(opt => opt.value === priority);
    return priorityOption?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Support Ticket Management</h2>
        
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={loadTickets}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tickets found matching your criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">#{ticket.id} • {ticket.customerName}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.category}</p>
                      <p className="text-xs text-gray-500">Created: {formatDate(ticket.createdAt)}</p>
                      {ticket.assignedTo && (
                        <p className="text-xs text-blue-600">Assigned to: {ticket.assignedTo}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div>
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedTicket.subject}</h3>
                  <div className="flex space-x-2 mb-3">
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Customer:</p>
                  <p className="text-sm text-gray-600">{selectedTicket.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedTicket.customerEmail}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Category:</p>
                  <p className="text-sm text-gray-600">{selectedTicket.category}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Description:</p>
                  <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Created:</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                
                {selectedTicket.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assigned to:</p>
                    <p className="text-sm text-gray-600">{selectedTicket.assignedTo}</p>
                  </div>
                )}
                
                {/* Update Actions */}
                <div className="pt-4 border-t space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Status:</label>
                    <select
                      onChange={(e) => {
                        const value = e.target.value as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
                        if (value) updateTicket(selectedTicket.id, { status: value });
                      }}
                      disabled={isUpdating}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select status...</option>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to:</label>
                    <Input
                      type="text"
                      placeholder="Agent name..."
                      onBlur={(e) => {
                        if (e.target.value) {
                          updateTicket(selectedTicket.id, { assignedTo: e.target.value });
                        }
                      }}
                      disabled={isUpdating}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Response:</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add your response to the customer..."
                    />
                    <Button
                      onClick={() => {
                        if (response.trim()) {
                          updateTicket(selectedTicket.id, { response });
                        }
                      }}
                      disabled={isUpdating || !response.trim()}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isUpdating ? 'Sending...' : 'Send Response'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
