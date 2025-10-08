'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { paymentService, TransactionHistory, PaymentAnalytics } from '@/services/paymentService';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface FilterOptions {
  orderId: string;
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

const PaymentHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    orderId: '',
    status: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
    orderId: '',
    status: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  const loadTransactionHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams: any = {};
      if (appliedFilters.orderId) filterParams.orderId = appliedFilters.orderId;
      if (appliedFilters.status) filterParams.status = appliedFilters.status;
      if (appliedFilters.type) filterParams.type = appliedFilters.type;
      if (appliedFilters.dateFrom) filterParams.dateFrom = appliedFilters.dateFrom;
      if (appliedFilters.dateTo) filterParams.dateTo = appliedFilters.dateTo;

      const data = await paymentService.getTransactionHistory(filterParams);
      setTransactions(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadTransactionHistory();
  }, [appliedFilters, loadTransactionHistory]);

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      
      const dateRange = appliedFilters.dateFrom && appliedFilters.dateTo ? {
        startDate: appliedFilters.dateFrom,
        endDate: appliedFilters.dateTo
      } : undefined;

      const analyticsData = await paymentService.getPaymentAnalytics(dateRange);
      setAnalytics(analyticsData);
      setShowAnalytics(true);
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      orderId: '',
      status: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setShowFilters(false);
  };

  const exportTransactions = () => {
    // Create CSV content
    const csvContent = [
      ['Transaction ID', 'Type', 'Order ID', 'Amount', 'Status', 'Description', 'Date'],
      ...transactions.map(t => [
        t.id,
        t.type,
        t.orderId,
        `₹${t.amount.toFixed(2)}`,
        t.status,
        t.description,
        new Date(t.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCardIcon className="h-5 w-5 text-green-500" />;
      case 'refund':
        return <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />;
      case 'settlement':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <CurrencyRupeeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
      'refunded': 'bg-purple-100 text-purple-800 border-purple-200'
    };

    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">Track your transactions and payment analytics</p>
        </div>

        {/* Analytics Summary */}
        {analytics && showAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalTransactions}</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {paymentService.formatCurrency(analytics.totalAmount)}
                    </p>
                  </div>
                  <CurrencyRupeeIcon className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.successRate.toFixed(1)}%</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Value</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {paymentService.formatCurrency(analytics.averageTransactionValue)}
                    </p>
                  </div>
                  <CreditCardIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            <Button
              onClick={loadAnalytics}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={analyticsLoading}
            >
              {analyticsLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
              ) : (
                <ChartBarIcon className="h-4 w-4" />
              )}
              <span>Analytics</span>
            </Button>

            <Button
              onClick={loadTransactionHistory}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={exportTransactions}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={transactions.length === 0}
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Order ID"
                  value={filters.orderId}
                  onChange={(e) => handleFilterChange('orderId', e.target.value)}
                  placeholder="Enter order ID"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="payment">Payment</option>
                    <option value="refund">Refund</option>
                    <option value="settlement">Settlement</option>
                  </select>
                </div>

                <Input
                  label="From Date"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />

                <Input
                  label="To Date"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={clearFilters} variant="outline">
                  Clear All
                </Button>
                <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({transactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-600">
                  {Object.values(appliedFilters).some(filter => filter) 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Your transaction history will appear here once you make payments.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Transaction ID</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize font-medium text-sm">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm font-mono">{transaction.id}</td>
                        <td className="py-3 px-2 text-sm font-medium">{transaction.orderId}</td>
                        <td className="py-3 px-2 text-sm font-semibold">₹{transaction.amount.toFixed(2)}</td>
                        <td className="py-3 px-2">{getStatusBadge(transaction.status)}</td>
                        <td className="py-3 px-2 text-sm text-gray-600 max-w-xs truncate" title={transaction.description}>
                          {transaction.description}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentHistory;
