'use client';

import { AuthGuard } from '@/modules/core';
import BusinessAnalyticsDashboard from '@/components/analytics/BusinessAnalyticsDashboard';

export default function BusinessAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN']}>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <BusinessAnalyticsDashboard />
      </section>
    </AuthGuard>
  );
}

