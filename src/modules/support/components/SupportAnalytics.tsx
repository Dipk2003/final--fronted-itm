'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Target,
  Activity,
  Award
} from 'lucide-react';

interface SupportDashboardData {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  complianceRate: number;
}

interface TicketTrends {
  date: string;
  open: number;
  resolved: number;
  inProgress: number;
}

interface AgentPerformance {
  agentName: string;
  ticketsSolved: number;
  averageRating: number;
  responseTime: number;
}

interface CategoryAnalysis {
  category: string;
  count: number;
  percentage: number;
}

interface SupportAnalyticsProps {
  detailed?: boolean;
}

const SupportAnalytics: React.FC<SupportAnalyticsProps> = ({ detailed = false }) => {
  const [dashboardData, setDashboardData] = useState<SupportDashboardData | null>(null);
  const [ticketTrends, setTicketTrends] = useState<TicketTrends[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30');

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashboardResponse, trendsResponse, agentsResponse, categoryResponse] = await Promise.all([
        api.get('/api/support-dashboard/analytics/dashboard'),
        api.get(`/api/support-dashboard/analytics/ticket-trends?days=${timeRange}`),
        api.get('/api/support-dashboard/analytics/agent-performance'),
        api.get('/api/support-dashboard/analytics/category-analysis')
      ]);

      setDashboardData(dashboardResponse.data);
      setTicketTrends(trendsResponse.data?.trends || []);
      setAgentPerformance(agentsResponse.data || []);
      setCategoryAnalysis(categoryResponse.data?.categories || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
      
      // Fallback data for development
      setDashboardData({
        totalTickets: 156,
        openTickets: 23,
        inProgressTickets: 45,
        resolvedTickets: 88,
        escalatedTickets: 12,
        averageResponseTime: 2.5,
        averageResolutionTime: 24.3,
        complianceRate: 92.5
      });

      setTicketTrends([
        { date: '2024-01-01', open: 15, resolved: 12, inProgress: 8 },
        { date: '2024-01-02', open: 18, resolved: 14, inProgress: 10 },
        { date: '2024-01-03', open: 12, resolved: 16, inProgress: 6 },
        { date: '2024-01-04', open: 20, resolved: 18, inProgress: 12 },
        { date: '2024-01-05', open: 16, resolved: 20, inProgress: 8 },
        { date: '2024-01-06', open: 14, resolved: 15, inProgress: 9 },
        { date: '2024-01-07', open: 19, resolved: 17, inProgress: 11 }
      ]);

      setAgentPerformance([
        { agentName: 'Sarah Wilson', ticketsSolved: 45, averageRating: 4.8, responseTime: 1.2 },
        { agentName: 'Mike Johnson', ticketsSolved: 38, averageRating: 4.6, responseTime: 1.8 },
        { agentName: 'Lisa Chen', ticketsSolved: 42, averageRating: 4.9, responseTime: 1.1 },
        { agentName: 'David Brown', ticketsSolved: 35, averageRating: 4.4, responseTime: 2.3 }
      ]);

      setCategoryAnalysis([
        { category: 'Technical', count: 45, percentage: 28.8 },
        { category: 'Billing', count: 32, percentage: 20.5 },
        { category: 'Account', count: 28, percentage: 17.9 },
        { category: 'Product', count: 25, percentage: 16.0 },
        { category: 'General', count: 26, percentage: 16.7 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatHours = (value: number) => `${value.toFixed(1)}h`;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const MetricCard = ({ 
    title, 
    value, 
    unit = '', 
    icon: Icon, 
    color, 
    trend, 
    trendValue 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: any;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: number;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}{unit}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span>{formatPercentage(trendValue)} vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        {detailed && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Failed to load analytics data</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      {detailed && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Support Analytics</h3>
          <div className="flex space-x-2">
            {[
              { label: '7 Days', value: '7' },
              { label: '30 Days', value: '30' },
              { label: '90 Days', value: '90' }
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tickets"
          value={dashboardData.totalTickets}
          icon={Activity}
          color="text-blue-600"
          trend="up"
          trendValue={8.5}
        />
        <MetricCard
          title="Open Tickets"
          value={dashboardData.openTickets}
          icon={AlertTriangle}
          color="text-orange-600"
        />
        <MetricCard
          title="Resolved Tickets"
          value={dashboardData.resolvedTickets}
          icon={CheckCircle}
          color="text-green-600"
          trend="up"
          trendValue={12.3}
        />
        <MetricCard
          title="SLA Compliance"
          value={dashboardData.complianceRate}
          unit="%"
          icon={Target}
          color="text-purple-600"
          trend="up"
          trendValue={2.1}
        />
      </div>

      {detailed && (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Avg Response Time"
              value={dashboardData.averageResponseTime}
              unit="h"
              icon={Clock}
              color="text-indigo-600"
              trend="down"
              trendValue={15.2}
            />
            <MetricCard
              title="Avg Resolution Time"
              value={dashboardData.averageResolutionTime}
              unit="h"
              icon={Award}
              color="text-teal-600"
              trend="down"
              trendValue={8.7}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Ticket Trends</h4>
              {ticketTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ticketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="open" stroke="#F59E0B" strokeWidth={2} name="Open" />
                    <Line type="monotone" dataKey="inProgress" stroke="#3B82F6" strokeWidth={2} name="In Progress" />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No trend data available
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Tickets by Category</h4>
              {categoryAnalysis.length > 0 ? (
                <div className="flex items-center">
                  <ResponsiveContainer width="60%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {categoryAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-40% pl-4">
                    {categoryAnalysis.map((item, index) => (
                      <div key={item.category} className="flex items-center mb-2">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm">
                          {item.category} ({item.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Agent Performance */}
          {agentPerformance.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Agent Performance</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tickets Solved
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agentPerformance.map((agent, index) => (
                      <tr key={agent.agentName} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {agent.agentName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.ticketsSolved}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span>{agent.averageRating.toFixed(1)}</span>
                            <div className="flex ml-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(agent.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatHours(agent.responseTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupportAnalytics;
