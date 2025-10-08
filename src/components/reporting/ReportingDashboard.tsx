'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ReportingDashboardProps {
  type: 'sales' | 'vendor' | 'marketplace';
  vendorId?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ReportingDashboard: React.FC<ReportingDashboardProps> = ({
  type,
  vendorId
}) => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/reports/${type}`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            vendorId
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  }, [endDate, startDate, token, type, vendorId]);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate, type, vendorId, fetchReportData]);

  const renderSalesOverview = () => {
    if (!reportData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl">₹{reportData.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl">{reportData.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
          <p className="text-3xl">₹{reportData.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>
    );
  };

  const renderSalesTrends = () => {
    if (!reportData?.dailySalesTrend?.trend) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Sales Trends</h3>
        <LineChart
          width={800}
          height={400}
          data={reportData.dailySalesTrend.trend}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </div>
    );
  };

  const renderCategoryDistribution = () => {
    if (!reportData?.salesByCategory) return null;

    const data = Object.entries(reportData.salesByCategory).map(([name, value]) => ({
      name,
      value
    }));

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  };

  const renderVendorMetrics = () => {
    if (!reportData || type !== 'vendor') return null;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Customer Retention Rate</h3>
            <p className="text-3xl">{reportData.customerRetentionRate.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">New Customers</h3>
            <p className="text-3xl">{reportData.newCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
            <p className="text-3xl">{reportData.averageRating.toFixed(1)}/5.0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Product</th>
                  <th className="px-6 py-3 border-b text-right">Total Sales</th>
                  <th className="px-6 py-3 border-b text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topProducts?.map((product: any) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 border-b">{product.productName}</td>
                    <td className="px-6 py-4 border-b text-right">{product.totalSales}</td>
                    <td className="px-6 py-4 border-b text-right">
                      ₹{product.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMarketplaceAnalytics = () => {
    if (!reportData || type !== 'marketplace') return null;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total GMV</h3>
            <p className="text-3xl">₹{reportData.totalGMV.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl">{reportData.userEngagement?.activeUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">New Vendors</h3>
            <p className="text-3xl">{reportData.userMetrics?.newVendors}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <BarChart
            width={800}
            height={400}
            data={Object.entries(reportData.categoryPerformance || {}).map(([category, metrics]: [string, any]) => ({
              category,
              orderCount: metrics.orderCount,
              revenue: metrics.revenue,
              growth: metrics.growth
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={selectedMetric} fill="#8884d8" />
          </BarChart>
          <div className="mt-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="revenue">Revenue</option>
              <option value="orderCount">Order Count</option>
              <option value="growth">Growth Rate</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          {type === 'sales' && 'Sales Report'}
          {type === 'vendor' && 'Vendor Performance Report'}
          {type === 'marketplace' && 'Marketplace Analytics'}
        </h2>
        <div className="flex items-center space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            className="px-4 py-2 border rounded-lg"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            className="px-4 py-2 border rounded-lg"
            placeholderText="End Date"
          />
        </div>
      </div>

      {type === 'sales' && (
        <>
          {renderSalesOverview()}
          {renderSalesTrends()}
          {renderCategoryDistribution()}
        </>
      )}

      {type === 'vendor' && renderVendorMetrics()}
      {type === 'marketplace' && renderMarketplaceAnalytics()}
    </div>
  );
};
