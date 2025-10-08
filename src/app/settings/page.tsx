'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page
    router.replace('/profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to profile...</p>
      </div>
    </div>
  );
};

export default SettingsPage;
