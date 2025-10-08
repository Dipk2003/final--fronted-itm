'use client';

import { useState, useEffect } from 'react';
import { adminStatsAPI, AdminStats } from '@/lib/adminApi';

export default function AdminStatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await adminStatsAPI.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-md border shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-red-400 mr-2">❌</div>
          <div className="text-red-800">{error}</div>
        </div>
        <button 
          onClick={fetchStats}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statsDisplay = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "👥" },
    { label: "Total Vendors", value: stats.totalVendors.toLocaleString(), icon: "🏢" },
    { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: "📦" },
    { label: "Revenue", value: formatRevenue(stats.revenue), icon: "💰" },
    { label: "Growth", value: `+${stats.growth}%`, icon: "📈" },
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: "⏳" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statsDisplay.map((stat, i) => (
        <div key={i} className="bg-white p-4 rounded-md border shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xl mb-1">{stat.icon}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
          <div className="font-bold text-lg">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
