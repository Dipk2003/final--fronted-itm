import React from 'react';
import { SupportTicket } from '@/modules/support/services/supportApi';

interface UserTicketListProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onRefresh: () => void;
}

const UserTicketList: React.FC<UserTicketListProps> = ({ tickets, isLoading, onRefresh }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Support Tickets</h3>
        <button
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No support tickets found. Submit a request to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">#{ticket.id}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{ticket.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">{ticket.category}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
              </div>
              
              {ticket.adminResponse && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <h5 className="text-sm font-medium text-blue-900 mb-1">Admin Response:</h5>
                  <p className="text-sm text-blue-800">{ticket.adminResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTicketList;
