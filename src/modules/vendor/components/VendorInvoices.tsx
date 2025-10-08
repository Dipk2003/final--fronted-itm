'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoiceDate: string;
  serviceName: string;
  invoiceType: 'I' | 'C'; // I = Invoice, C = Credit Note
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  buyerName: string;
  buyerCompany: string;
  dueDate?: string;
  paymentMethod?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2023-001',
    invoiceDate: '26-Oct-2023',
    serviceName: 'Star Value+',
    invoiceType: 'I',
    totalAmount: 26471,
    status: 'paid',
    buyerName: 'John Doe',
    buyerCompany: 'Tech Solutions Ltd',
    dueDate: '26-Nov-2023',
    paymentMethod: 'Online Transfer'
  },
  {
    id: 'INV-2023-002',
    invoiceDate: '26-Oct-2023',
    serviceName: 'Star',
    invoiceType: 'I',
    totalAmount: 58823,
    status: 'paid',
    buyerName: 'Jane Smith',
    buyerCompany: 'Manufacturing Co.',
    dueDate: '26-Nov-2023',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'CN-2023-001',
    invoiceDate: '31-Mar-2023',
    serviceName: 'Mini Dynamic Catalog',
    invoiceType: 'C',
    totalAmount: 14750,
    status: 'pending',
    buyerName: 'Mike Johnson',
    buyerCompany: 'Construction Inc.',
    dueDate: '30-Apr-2023'
  },
  {
    id: 'INV-2023-003',
    invoiceDate: '31-Mar-2023',
    serviceName: 'Star',
    invoiceType: 'C',
    totalAmount: 26550,
    status: 'overdue',
    buyerName: 'Sarah Wilson',
    buyerCompany: 'Design Studio',
    dueDate: '30-Apr-2023'
  },
  {
    id: 'INV-2023-004',
    invoiceDate: '31-Mar-2023',
    serviceName: 'Star Value+',
    invoiceType: 'C',
    totalAmount: 11062,
    status: 'paid',
    buyerName: 'David Brown',
    buyerCompany: 'Electronics Ltd',
    dueDate: '30-Apr-2023',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'CN-2023-002',
    invoiceDate: '31-Mar-2023',
    serviceName: 'Mini Dynamic Catalog',
    invoiceType: 'C',
    totalAmount: 7375,
    status: 'pending',
    buyerName: 'Lisa Garcia',
    buyerCompany: 'Trading Co.',
    dueDate: '30-Apr-2023'
  },
  {
    id: 'INV-2023-005',
    invoiceDate: '28-Dec-2022',
    serviceName: 'Star',
    invoiceType: 'I',
    totalAmount: 26550,
    status: 'paid',
    buyerName: 'Robert Davis',
    buyerCompany: 'Industrial Solutions',
    dueDate: '28-Jan-2023',
    paymentMethod: 'Online Transfer'
  },
  {
    id: 'INV-2023-006',
    invoiceDate: '28-Dec-2022',
    serviceName: 'Star Value+',
    invoiceType: 'I',
    totalAmount: 11062,
    status: 'paid',
    buyerName: 'Emma Taylor',
    buyerCompany: 'Service Provider',
    dueDate: '28-Jan-2023',
    paymentMethod: 'Credit Card'
  }
];

export default function VendorInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = selectedTab === 'all' || invoice.status === selectedTab;
    const matchesSearch = invoice.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid', icon: '✅' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: '⏳' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue', icon: '⚠️' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getInvoiceTypeLabel = (type: string) => {
    return type === 'I' ? 'Invoice' : 'Credit Note';
  };

  const getTotalStats = () => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

    return { totalAmount, paidAmount, pendingAmount, overdueAmount };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>📄</span>
              <span>Invoices & Payments</span>
            </h2>
            <p className="text-gray-600 mt-1">Track your billing and payment history</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
              <span>📊</span>
              <span>Generate Report</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
              <span>➕</span>
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                <p className="text-xl font-bold text-blue-900">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Paid</p>
                <p className="text-xl font-bold text-green-900">₹{stats.paidAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-xl font-bold text-yellow-900">₹{stats.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Overdue</p>
                <p className="text-xl font-bold text-red-900">₹{stats.overdueAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search invoices, services, or buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedTab(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    selectedTab === status
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status} ({status === 'all' ? invoices.length : invoices.filter(inv => inv.status === status).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.invoiceDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.serviceName}</div>
                      <div className="text-sm text-gray-500">{invoice.buyerCompany}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.invoiceType === 'I' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {getInvoiceTypeLabel(invoice.invoiceType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Print
                      </button>
                      <span>/</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Download
                      </button>
                      <span>/</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new invoice</p>
          </div>
        )}

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInvoices.length}</span> of{' '}
                <span className="font-medium">{filteredInvoices.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Reminder Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-900">Payment Reminders</h3>
            <p className="text-orange-700">Keep track of overdue payments and send reminders</p>
          </div>
        </div>

        {invoices.filter(inv => inv.status === 'overdue').length > 0 ? (
          <div className="space-y-3">
            {invoices.filter(inv => inv.status === 'overdue').slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.serviceName}</p>
                    <p className="text-sm text-gray-600">{invoice.buyerCompany} • ₹{invoice.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-red-600">Due: {invoice.dueDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm">
                      Send Reminder
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                      Mark Paid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-orange-700">🎉 All payments are up to date!</p>
          </div>
        )}
      </div>
    </div>
  );
}
