'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface SLATrackingProps {
  detailed?: boolean;
}

interface SLATracking {
  id: number;
  ticketId: number;
  ticketNumber: string;
  status: string;
  priority: string;
  responseDeadline: string;
  resolutionDeadline: string;
  responseBreached: boolean;
  resolutionBreached: boolean;
  responseComplianceScore: number;
  resolutionComplianceScore: number;
}

interface SLACompliance {
  overallCompliance: number;
  details: Array<{
    category: string;
    priority: string;
    responseCompliance: number;
    resolutionCompliance: number;
  }>;
}

const SLATrackingPanel: React.FC<SLATrackingProps> = ({ detailed = false }) => {
  const [slaTracking, setSlaTracking] = useState<SLATracking[]>([]);
  const [slaCompliance, setSlaCompliance] = useState<SLACompliance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSLAData();
  }, []);

  const fetchSLAData = async () => {
    try {
      const [trackingResponse, complianceResponse] = await Promise.all([
        api.get('/api/support-dashboard/sla/tracking'),
        api.get('/api/support-dashboard/sla/reports/compliance')
      ]);
      
      setSlaTracking(trackingResponse.data.content || []);
      setSlaCompliance(complianceResponse.data);
    } catch (error) {
      console.error('Error fetching SLA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (breached: boolean) => {
    return breached ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">SLA Tracking</h2>
        {slaCompliance && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            slaCompliance.overallCompliance >= 90 
              ? 'text-green-600 bg-green-50' 
              : slaCompliance.overallCompliance >= 70 
              ? 'text-yellow-600 bg-yellow-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {slaCompliance.overallCompliance.toFixed(1)}% Compliance
          </div>
        )}
      </div>

      {detailed && slaCompliance && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Compliance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slaCompliance.details.map((detail, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{detail.category}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(detail.priority)}`}>
                    {detail.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Response: {detail.responseCompliance.toFixed(1)}%</div>
                  <div>Resolution: {detail.resolutionCompliance.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resolution</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slaTracking.slice(0, detailed ? undefined : 5).map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                  #{item.ticketNumber}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(item.responseBreached)}`}>
                    {item.responseBreached ? 'Breached' : 'On Time'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.responseComplianceScore?.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(item.resolutionBreached)}`}>
                    {item.resolutionBreached ? 'Breached' : 'On Time'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.resolutionComplianceScore?.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'RESOLVED' ? 'text-green-600 bg-green-50' :
                    item.status === 'IN_PROGRESS' ? 'text-blue-600 bg-blue-50' :
                    'text-gray-600 bg-gray-50'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!detailed && slaTracking.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All SLA Tracking →
          </button>
        </div>
      )}
    </div>
  );
};

export default SLATrackingPanel;
