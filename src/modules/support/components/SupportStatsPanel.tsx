'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  complianceRate: number;
}

const SupportStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    escalatedTickets: 0,
    averageResponseTime: 0,
    averageResolutionTime: 0,
    complianceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportStats();
  }, []);

  const fetchSupportStats = async () => {
    try {
      const response = await api.get('/api/support-dashboard/analytics/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching support stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: '🎫',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: '📥',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTickets,
      icon: '⚡',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Resolved',
      value: stats.resolvedTickets,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Escalated',
      value: stats.escalatedTickets,
      icon: '🔺',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Avg Response Time',
      value: `${stats.averageResponseTime}h`,
      icon: '⏱️',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg Resolution Time',
      value: `${stats.averageResolutionTime}h`,
      icon: '🔧',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'SLA Compliance',
      value: `${stats.complianceRate}%`,
      icon: '📊',
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow-md border border-gray-100`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`${card.color} text-white p-3 rounded-full text-xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportStatsPanel;
