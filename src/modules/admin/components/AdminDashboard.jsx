import React, { useEffect, useState } from 'react';
import { Card } from '@/shared/components';
import { adminAnalyticsApi } from '@/shared/services/api/adminAnalyticsApi';
import { formatCurrency } from '@/utils/formatter';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const statsData = await adminAnalyticsApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">Total Vendors</h2>
          <p className="text-3xl">{stats.totalVendors}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">Active Products</h2>
          <p className="text-3xl">{stats.activeProducts}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Revenue</h2>
          <p className="text-3xl">{formatCurrency(stats.totalRevenue)}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">New Inquiries (This Week)</h2>
          <p className="text-3xl">{stats.newInquiriesThisWeek}</p>
        </Card>
      </div>
    </div>
  );
}

