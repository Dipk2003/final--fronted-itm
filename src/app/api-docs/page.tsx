'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to prevent SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
) as any;

const APIDocsPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set up Swagger UI preferences (only on client side)
    try {
      const preferredTheme = localStorage.getItem('theme');
      if (preferredTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      }
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn('Could not access localStorage:', error);
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              API Documentation
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Complete documentation for ITech B2B Platform API
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Documentation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete documentation for ITech B2B Platform API
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <SwaggerUI
            url={process.env.NEXT_PUBLIC_API_URL + '/v3/api-docs'}
            docExpansion="list"
            filter={true}
            persistAuthorization={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
