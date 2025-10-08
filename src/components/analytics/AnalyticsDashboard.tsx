'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card } from '@/shared/components/Card';
import { Select } from '@/shared/components/Select';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartPieIcon 
} from '@heroicons/react/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MetricData {
  date: string;
  value: number;
}

interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderTrend: MetricData[];
  totalProducts: number;
  activeProducts: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
  productViews: Record<string, number>;
  newCustomers: number;
  repeatCustomers: number;
  customerLocations: Record<string, number>;
  customerRetentionRate: number;
  conversionRate: number;
  marketShare: {
    percentage: number;
    rank: number;
  };
  competitorAnalysis: Array<{
    name: string;
    marketShare: number;
  }>;
  categoryPerformance: {
    sales: Record<string, number>;
    growth: Record<string, number>;
  };
  growthRate: {
    revenue: number;
    orders: number;
  };
  projectedRevenue: {
    projected: number;
    confidence: number;
  };
  seasonalTrends: {
    revenue: MetricData[];
    orders: MetricData[];
    products: MetricData[];
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchDashboardMetrics = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!metrics) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { label: 'Today', value: 'today' },
            { label: 'This Week', value: 'week' },
            { label: 'This Month', value: 'month' },
            { label: 'This Quarter', value: 'quarter' },
            { label: 'This Year', value: 'year' }
          ]}
          className="w-48"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 p-3 rounded-full">
                <CurrencyRupeeIcon className="h-6 w-6 text-blue-600" />
              </div>
              {metrics.growthRate.revenue > 0 ? (
                <TrendingUpIcon className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDownIcon className="h-6 w-6 text-red-500" />
              )}
            </div>
            <h3 className="text-xl font-bold mt-4">
              {formatCurrency(metrics.totalRevenue)}
            </h3>
            <p className="text-gray-600">Total Revenue</p>
            <div className="mt-2">
              <span className={metrics.growthRate.revenue > 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.growthRate.revenue > 0 ? '+' : ''}{metrics.growthRate.revenue.toFixed(1)}%
              </span>
              <span className="text-gray-500"> vs last {timeRange}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              {metrics.growthRate.orders > 0 ? (
                <TrendingUpIcon className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDownIcon className="h-6 w-6 text-red-500" />
              )}
            </div>
            <h3 className="text-xl font-bold mt-4">{metrics.totalOrders}</h3>
            <p className="text-gray-600">Total Orders</p>
            <div className="mt-2">
              <span className={metrics.growthRate.orders > 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.growthRate.orders > 0 ? '+' : ''}{metrics.growthRate.orders.toFixed(1)}%
              </span>
              <span className="text-gray-500"> vs last {timeRange}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-purple-100 p-3 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mt-4">{metrics.newCustomers}</h3>
            <p className="text-gray-600">New Customers</p>
            <div className="mt-2">
              <span className="text-purple-600">
                {metrics.customerRetentionRate.toFixed(1)}%
              </span>
              <span className="text-gray-500"> retention rate</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-orange-100 p-3 rounded-full">
                <ChartPieIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mt-4">
              {metrics.marketShare.percentage.toFixed(1)}%
            </h3>
            <p className="text-gray-600">Market Share</p>
            <div className="mt-2">
              <span className="text-orange-600">#{metrics.marketShare.rank}</span>
              <span className="text-gray-500"> market position</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <Line
              data={{
                labels: metrics.seasonalTrends.revenue.map(d => 
                  new Date(d.date).toLocaleDateString('en-IN', { month: 'short' })),
                datasets: [{
                  label: 'Revenue',
                  data: metrics.seasonalTrends.revenue.map(d => d.value),
                  borderColor: 'rgb(59, 130, 246)',
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
              height={300}
            />
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <Bar
              data={{
                labels: Object.keys(metrics.categoryPerformance.sales),
                datasets: [{
                  label: 'Sales',
                  data: Object.values(metrics.categoryPerformance.sales),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
              height={300}
            />
          </div>
        </Card>

        {/* Customer Locations */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Locations</h3>
            <Doughnut
              data={{
                labels: Object.keys(metrics.customerLocations),
                datasets: [{
                  data: Object.values(metrics.customerLocations),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                    'rgba(168, 85, 247, 0.5)'
                  ]
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
              height={300}
            />
          </div>
        </Card>

        {/* Top Products */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-4">
              {metrics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-500 w-8">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.orders} orders
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Projected Revenue */}
      <Card className="bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Projection</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Confidence:</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${metrics.projectedRevenue.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                {metrics.projectedRevenue.confidence.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500">Current Revenue</p>
              <p className="text-2xl font-bold">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Projected Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(metrics.projectedRevenue.projected)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Growth Potential</p>
              <p className="text-2xl font-bold text-green-600">
                {((metrics.projectedRevenue.projected - metrics.totalRevenue) /
                  metrics.totalRevenue * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
