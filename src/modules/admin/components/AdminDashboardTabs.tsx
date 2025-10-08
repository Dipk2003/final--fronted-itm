'use client';

import { useState } from 'react';

interface AdminDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'vendors', label: 'Vendors', icon: '🏢' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛍️' },
  { id: 'support', label: 'Support', icon: '💬' },
];

export default function AdminDashboardTabs({ activeTab, onTabChange }: AdminDashboardTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
