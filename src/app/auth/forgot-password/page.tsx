'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/modules/core/components/ForgotPassword';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const handleBackToLogin = () => {
    router.push('/auth/user/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPassword onBackToLogin={handleBackToLogin} />
    </div>
  );
}
