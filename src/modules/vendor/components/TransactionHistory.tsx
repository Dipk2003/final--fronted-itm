'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Crown,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';
import { 
  VendorPackageTransaction, 
  vendorPackageAPI, 
  packageHelpers 
} from '../services/vendorPackageApi';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<VendorPackageTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await vendorPackageAPI.getTransactionHistory();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planType: string) => {
    const icons = {
      SILVER: Crown,
      GOLD: Star,
      PLATINUM: Zap,
      DIAMOND: Sparkles
    };
    return icons[planType as keyof typeof icons] || Crown;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendorPackage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case '7days':
          return (now.getTime() - transactionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case '30days':
          return (now.getTime() - transactionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case '90days':
          return (now.getTime() - transactionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDownloadReceipt = (transactionId: number | string) => {
    // Implement receipt download logic
    console.log('Downloading receipt for transaction:', transactionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Transaction History
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          View and manage your subscription purchase history
        </motion.p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Results */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'You haven\'t made any subscription purchases yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction, index) => {
              const IconComponent = getPlanIcon(transaction.vendorPackage?.planType || 'SILVER');
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Plan Icon */}
                      <div className={`p-3 rounded-full bg-gradient-to-r ${
                        transaction.vendorPackage?.planType === 'SILVER' ? 'from-gray-400 to-gray-600' :
                        transaction.vendorPackage?.planType === 'GOLD' ? 'from-yellow-400 to-yellow-600' :
                        transaction.vendorPackage?.planType === 'PLATINUM' ? 'from-purple-400 to-purple-600' :
                        'from-blue-400 to-blue-600'
                      }`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>

                      {/* Transaction Details */}
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.vendorPackage?.displayName || transaction.vendorPackage?.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                          </span>
                          
                          <span className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4" />
                            <span className="capitalize">{transaction.paymentMethod}</span>
                          </span>
                          
                          <span className="text-gray-400">•</span>
                          <span className="font-mono text-xs">{transaction.transactionId}</span>
                        </div>

                        {transaction.billingPeriod && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {transaction.billingPeriod === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Amount */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {packageHelpers.formatPrice(transaction.amount)}
                        </div>
                        {transaction.tax && (
                          <div className="text-sm text-gray-600">
                            (incl. GST: {packageHelpers.formatPrice(transaction.tax)})
                          </div>
                        )}
                      </div>

                      {/* Status Icon */}
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {transaction.status.toLowerCase() === 'completed' && (
                          <>
                            <button
                              onClick={() => handleDownloadReceipt(transaction.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Download Receipt"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            
                            {transaction.invoiceUrl && (
                              <a
                                href={transaction.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                title="View Invoice"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info for Failed Transactions */}
                  {transaction.status.toLowerCase() === 'failed' && transaction.failureReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800">
                          <strong>Failure Reason:</strong> {transaction.failureReason}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Subscription Info */}
                  {transaction.subscriptionStartDate && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-800">
                          <strong>Subscription Period:</strong> 
                          {` ${new Date(transaction.subscriptionStartDate).toLocaleDateString()} - ${transaction.subscriptionEndDate ? new Date(transaction.subscriptionEndDate).toLocaleDateString() : 'Ongoing'}`}
                        </span>
                        
                        {transaction.autoRenew && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Auto-renewal enabled
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {transactions.length}
            </div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {transactions.filter(t => t.status.toLowerCase() === 'completed').length}
            </div>
            <div className="text-gray-600">Successful Payments</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {packageHelpers.formatPrice(
                transactions
                  .filter(t => t.status.toLowerCase() === 'completed')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
