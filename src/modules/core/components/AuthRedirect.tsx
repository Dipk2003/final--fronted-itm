'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 AuthRedirect: User authenticated with role:', user.role);
      
      // Map user roles to their respective dashboards
      const dashboardMap: { [key: string]: string } = {
        // Handle various role formats
        'USER': '/dashboard/user',
        'user': '/dashboard/user',
        'BUYER': '/dashboard/user', // Map buyer to user dashboard
        'buyer': '/dashboard/user',
        'VENDOR': '/dashboard/vendor-panel',
        'vendor': '/dashboard/vendor-panel',
        'SELLER': '/dashboard/vendor-panel', // Map seller to vendor dashboard
        'seller': '/dashboard/vendor-panel',
        'ADMIN': '/dashboard/admin',
        'admin': '/dashboard/admin'
      };
      
      // Normalize the role (remove ROLE_ prefix if present)
      const userRole = user.role.replace('ROLE_', '');
      const dashboardPath = dashboardMap[userRole];
      
      console.log('🔄 AuthRedirect: Normalized role:', userRole, 'Dashboard path:', dashboardPath);
      
      if (dashboardPath) {
        console.log('✅ AuthRedirect: Redirecting to dashboard:', dashboardPath);
        router.push(dashboardPath);
      } else {
        console.warn('⚠️ AuthRedirect: Role not recognized, redirecting to home. Role:', userRole);
        // Fallback to home if role not recognized
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  return null;
}
