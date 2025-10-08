'use client';

import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
  children
}) => {
  const alertType = variant || type;
  const getAlertStyles = () => {
    switch (alertType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (alertType) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XMarkIcon className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getAlertStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
          {children && <div className="mt-2">{children}</div>}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
