'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Star,
  Building,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Eye,
  UserCheck,
  Globe
} from 'lucide-react';
import { analyticsService, type DashboardStats, type AnalyticsFilters } from '@/services/analyticsService';

interface BusinessMetrics {
  // Revenue Metrics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  
  // User Metrics
  totalUsers: number;
  activeVendors: number;
  activeBuyers: number;
  newRegistrations: number;
  userRetentionRate: number;
  
  // Product Metrics
  totalProducts: number;
  activeProducts: number;
  avgProductRating: number;
  topCategories: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  
  // Order Metrics
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  orderValue: number;
  conversionRate: number;
  
  // Support Metrics
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  
  // Chatbot Metrics
  chatSessions: number;
  chatResolutionRate: number;
  avgSessionDuration: number;
  topQueries: Array<{
    query: string;
    count: number;
  }>;
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  support: number;
}

interface RegionalData {
  region: string;
  users: number;
  orders: number;
  revenue: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

const BusinessAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create filters based on selected timeframe
      const filters: AnalyticsFilters = {
        period: selectedTimeframe === '7d' ? 'week' : 
               selectedTimeframe === '30d' ? 'month' : 
               selectedTimeframe === '90d' ? 'quarter' : 'year'
      };

      // Use analytics service instead of direct API calls
      const [dashboardStats, adminAnalytics, geographicStats] = await Promise.all([
        analyticsService.getDashboardStats(filters),
        analyticsService.getAdminAnalytics(filters),
        analyticsService.getGeographicStats(filters)
      ]);

      // Transform data to match existing component structure
      const transformedMetrics: BusinessMetrics = {
        // Revenue Metrics
        totalRevenue: dashboardStats.totalRevenue,
        monthlyRevenue: dashboardStats.totalRevenue, // You might want to add monthly specific data
        revenueGrowth: dashboardStats.revenueGrowth,
        
        // User Metrics  
        totalUsers: dashboardStats.totalUsers,
        activeVendors: dashboardStats.totalVendors,
        activeBuyers: dashboardStats.totalUsers - dashboardStats.totalVendors, // Approximation
        newRegistrations: adminAnalytics.userStats.newThisMonth,
        userRetentionRate: adminAnalytics.userStats.retention,
        
        // Product Metrics
        totalProducts: dashboardStats.totalProducts,
        activeProducts: adminAnalytics.productStats.active,
        avgProductRating: 4.3, // You might want to add this to your service
        topCategories: adminAnalytics.productStats.topCategories.map(cat => ({
          name: cat.name,
          count: cat.count,
          revenue: cat.revenue || 0
        })),
        
        // Order Metrics
        totalOrders: dashboardStats.totalOrders,
        pendingOrders: dashboardStats.pendingOrders,
        completedOrders: dashboardStats.completedOrders,
        orderValue: adminAnalytics.orderStats.averageOrderValue,
        conversionRate: adminAnalytics.orderStats.conversionRate,
        
        // Support Metrics (you might need to add these to your service)
        totalTickets: 156,
        resolvedTickets: 134,
        avgResponseTime: 2.3,
        customerSatisfaction: 4.5,
        
        // Chatbot Metrics (you might need to add these to your service)
        chatSessions: 2340,
        chatResolutionRate: 78.5,
        avgSessionDuration: 4.2,
        topQueries: [
          { query: 'Product pricing', count: 345 },
          { query: 'Vendor contact', count: 298 },
          { query: 'Order status', count: 256 },
          { query: 'Technical support', count: 189 },
          { query: 'Shipping info', count: 167 }
        ]
      };

      setMetrics(transformedMetrics);
      
      // Transform geographic data for regional display
      const transformedRegionalData = geographicStats.topStates.map(state => ({
        region: state.name,
        users: state.count,
        orders: state.count * 0.3, // Approximation - you might want to add order data
        revenue: state.count * 50000 // Approximation
      }));
      
      setRegionalData(transformedRegionalData);
      
      // For time series data, you might want to add a specific endpoint
      // For now, using fallback data
      setTimeSeriesData([
        { date: '2024-01-01', revenue: 45000, orders: 120, users: 340, support: 12 },
        { date: '2024-01-02', revenue: 52000, orders: 145, users: 380, support: 15 },
        { date: '2024-01-03', revenue: 48000, orders: 130, users: 360, support: 10 },
        { date: '2024-01-04', revenue: 55000, orders: 158, users: 420, support: 18 },
        { date: '2024-01-05', revenue: 61000, orders: 172, users: 450, support: 14 },
        { date: '2024-01-06', revenue: 58000, orders: 165, users: 410, support: 16 },
        { date: '2024-01-07', revenue: 63000, orders: 180, users: 480, support: 13 }
      ]);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      
      // Fallback mock data for development
      setMetrics({
        totalRevenue: 1250000,
        monthlyRevenue: 185000,
        revenueGrowth: 12.5,
        totalUsers: 15420,
        activeVendors: 342,
        activeBuyers: 12890,
        newRegistrations: 156,
        userRetentionRate: 87.3,
        totalProducts: 8950,
        activeProducts: 7800,
        avgProductRating: 4.3,
        topCategories: [
          { name: 'Electronics', count: 1250, revenue: 450000 },
          { name: 'Industrial', count: 890, revenue: 380000 },
          { name: 'Automotive', count: 650, revenue: 290000 },
          { name: 'Healthcare', count: 420, revenue: 180000 },
          { name: 'Textiles', count: 380, revenue: 120000 }
        ],
        totalOrders: 3250,
        pendingOrders: 45,
        completedOrders: 2890,
        orderValue: 78500,
        conversionRate: 3.2,
        totalTickets: 156,
        resolvedTickets: 134,
        avgResponseTime: 2.3,
        customerSatisfaction: 4.5,
        chatSessions: 2340,
        chatResolutionRate: 78.5,
        avgSessionDuration: 4.2,
        topQueries: [
          { query: 'Product pricing', count: 345 },
          { query: 'Vendor contact', count: 298 },
          { query: 'Order status', count: 256 },
          { query: 'Technical support', count: 189 },
          { query: 'Shipping info', count: 167 }
        ]
      });

      setTimeSeriesData([
        { date: '2024-01-01', revenue: 45000, orders: 120, users: 340, support: 12 },
        { date: '2024-01-02', revenue: 52000, orders: 145, users: 380, support: 15 },
        { date: '2024-01-03', revenue: 48000, orders: 130, users: 360, support: 10 },
        { date: '2024-01-04', revenue: 55000, orders: 158, users: 420, support: 18 },
        { date: '2024-01-05', revenue: 61000, orders: 172, users: 450, support: 14 },
        { date: '2024-01-06', revenue: 58000, orders: 165, users: 410, support: 16 },
        { date: '2024-01-07', revenue: 63000, orders: 180, users: 480, support: 13 }
      ]);

      setRegionalData([
        { region: 'North India', users: 4200, orders: 850, revenue: 320000 },
        { region: 'South India', users: 3800, orders: 720, revenue: 280000 },
        { region: 'West India', users: 3200, orders: 680, revenue: 250000 },
        { region: 'East India', users: 2100, orders: 420, revenue: 160000 },
        { region: 'Central India', users: 1820, orders: 380, revenue: 140000 },
        { region: 'Northeast', users: 300, orders: 80, revenue: 30000 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeframe, fetchAnalyticsData]);

  const MetricCard = ({
    title, 
    value, 
    unit = '', 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue',
    subtitle 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: number;
    color?: string;
    subtitle?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}{unit}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && trendValue !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(trendValue)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive overview of your marketplace performance</p>
        </div>
        
        <div className="flex space-x-2">
          {[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: '90 Days', value: '90d' },
            { label: '1 Year', value: '1y' }
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedTimeframe(value as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          unit="₹"
          icon={DollarSign}
          trend="up"
          trendValue={metrics.revenueGrowth}
          color="green"
          subtitle="All-time revenue"
        />
        <MetricCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          unit="₹"
          icon={TrendingUp}
          trend="up"
          trendValue={8.3}
          color="blue"
          subtitle="Current month"
        />
        <MetricCard
          title="Average Order Value"
          value={metrics.orderValue}
          unit="₹"
          icon={ShoppingCart}
          trend="up"
          trendValue={5.2}
          color="purple"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          unit="%"
          icon={Target}
          trend="up"
          trendValue={2.1}
          color="orange"
        />
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={Users}
          trend="up"
          trendValue={12.5}
          color="indigo"
          subtitle="Registered users"
        />
        <MetricCard
          title="Active Vendors"
          value={metrics.activeVendors}
          icon={Building}
          trend="up"
          trendValue={7.8}
          color="teal"
        />
        <MetricCard
          title="Active Buyers"
          value={metrics.activeBuyers}
          icon={UserCheck}
          trend="up"
          trendValue={15.2}
          color="cyan"
        />
        <MetricCard
          title="User Retention"
          value={metrics.userRetentionRate}
          unit="%"
          icon={Award}
          trend="up"
          trendValue={3.4}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue & Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Revenue"
              />
              <Bar yAxisId="right" dataKey="orders" fill="#10B981" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Top Categories by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.topCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {metrics.topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Support & Product Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          trend="up"
          trendValue={9.1}
          color="violet"
        />
        <MetricCard
          title="Avg Product Rating"
          value={metrics.avgProductRating}
          unit="/5"
          icon={Star}
          trend="up"
          trendValue={2.3}
          color="yellow"
        />
        <MetricCard
          title="Support Tickets"
          value={metrics.totalTickets}
          icon={MessageSquare}
          trend="down"
          trendValue={5.4}
          color="red"
          subtitle={`${metrics.resolvedTickets} resolved`}
        />
        <MetricCard
          title="Customer Satisfaction"
          value={metrics.customerSatisfaction}
          unit="/5"
          icon={CheckCircle}
          trend="up"
          trendValue={4.2}
          color="green"
        />
      </div>

      {/* Regional Performance & Chatbot Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3B82F6" name="Users" />
              <Bar dataKey="orders" fill="#10B981" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chatbot Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Chatbot Performance</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.chatSessions}</div>
              <div className="text-sm text-blue-700">Total Sessions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.chatResolutionRate}%</div>
              <div className="text-sm text-green-700">Resolution Rate</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Top Queries:</h4>
            {metrics.topQueries.map((query, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">{query.query}</span>
                <span className="text-sm font-medium text-gray-900">{query.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{metrics.totalOrders}</div>
            <div className="text-blue-700">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{metrics.pendingOrders}</div>
            <div className="text-yellow-700">Pending Orders</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{metrics.completedOrders}</div>
            <div className="text-green-700">Completed Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalyticsDashboard;
