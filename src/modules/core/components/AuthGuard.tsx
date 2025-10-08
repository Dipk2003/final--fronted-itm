/**
 * 🛡️ Auth Guard Component
 * 
 * Protects routes that require authentication
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  allowedRoles,
  fallback,
  redirectTo = '/auth/user/login',
}) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  
  React.useEffect(() => {
    console.log('🛡️ AuthGuard useEffect triggered:', {
      loading,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      allowedRoles,
      requireAuth
    });
    
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        console.log('🔒 AuthGuard: User not authenticated, redirecting to:', redirectTo);
        router.push(redirectTo);
        return;
      }
      
      if (isAuthenticated && user) {
        const isRoleValid = () => {
          if (!user.role) return false;
          
          const userRole = user.role.toUpperCase();
          
          if (requiredRole) {
            const normalizedRequired = requiredRole.toUpperCase();
            return userRole === normalizedRequired || 
                   userRole === `ROLE_${normalizedRequired}` ||
                   `ROLE_${userRole}` === normalizedRequired ||
                   // Handle specific role mappings
                   (userRole === 'BUYER' && (normalizedRequired === 'USER' || normalizedRequired === 'ROLE_USER')) ||
                   (userRole === 'SELLER' && (normalizedRequired === 'VENDOR' || normalizedRequired === 'ROLE_VENDOR'));
          }
          
          if (allowedRoles && allowedRoles.length > 0) {
            const normalizedAllowed = allowedRoles.map(role => role.toUpperCase());
            return normalizedAllowed.some(allowedRole => 
              userRole === allowedRole || 
              userRole === `ROLE_${allowedRole}` ||
              `ROLE_${userRole}` === allowedRole ||
              userRole.replace('ROLE_', '') === allowedRole.replace('ROLE_', '') ||
              // Handle specific role mappings
              (userRole === 'BUYER' && (allowedRole === 'USER' || allowedRole === 'ROLE_USER')) ||
              (userRole === 'SELLER' && (allowedRole === 'VENDOR' || allowedRole === 'ROLE_VENDOR'))
            );
          }
          
          return true;
        };
        
        if (!isRoleValid()) {
          console.log('🚫 AuthGuard: Role not authorized. User role:', user?.role, 'Required:', requiredRole || allowedRoles);
          router.push('/unauthorized');
          return;
        }
        
        console.log('✅ AuthGuard: Access granted');
      }
    }
  }, [isAuthenticated, user, loading, requireAuth, requiredRole, allowedRoles, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check role authorization
  const isRoleAuthorized = () => {
    if (!user || !user.role) {
      console.log('🚫 No user or role found');
      return false;
    }
    
    const userRole = user.role.toUpperCase();
    console.log('🔍 Role Authorization Check:', {
      userRole: userRole,
      requiredRole: requiredRole,
      allowedRoles: allowedRoles
    });
    
    if (requiredRole) {
      const normalizedRequired = requiredRole.toUpperCase();
      const isMatch = userRole === normalizedRequired || 
                     userRole === `ROLE_${normalizedRequired}` ||
                     `ROLE_${userRole}` === normalizedRequired ||
                     // Handle specific role mappings
                     (userRole === 'BUYER' && (normalizedRequired === 'USER' || normalizedRequired === 'ROLE_USER')) ||
                     (userRole === 'SELLER' && (normalizedRequired === 'VENDOR' || normalizedRequired === 'ROLE_VENDOR'));
      console.log('✅ Single role check result:', isMatch);
      return isMatch;
    }
    
    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedAllowed = allowedRoles.map(role => role.toUpperCase());
      const isMatch = normalizedAllowed.some(allowedRole => 
        userRole === allowedRole || 
        userRole === `ROLE_${allowedRole}` ||
        `ROLE_${userRole}` === allowedRole ||
        userRole.replace('ROLE_', '') === allowedRole.replace('ROLE_', '') ||
        // Handle specific role mappings
        (userRole === 'BUYER' && (allowedRole === 'USER' || allowedRole === 'ROLE_USER')) ||
        (userRole === 'SELLER' && (allowedRole === 'VENDOR' || allowedRole === 'ROLE_VENDOR'))
      );
      console.log('✅ Multiple roles check result:', isMatch);
      return isMatch;
    }
    
    return true; // No role requirement
  };

  if (!isRoleAuthorized()) {
    console.log('🚫 AuthGuard: Role check failed. User role:', user?.role, 'Required:', requiredRole || allowedRoles);
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Your role: {user?.role}</p>
          <p className="text-sm text-gray-500">Required: {requiredRole || allowedRoles?.join(', ')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
