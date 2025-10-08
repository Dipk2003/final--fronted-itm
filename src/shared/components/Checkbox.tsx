'use client';

import React from 'react';

interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600 focus:ring-blue-500';
      case 'success':
        return 'text-green-600 focus:ring-green-500';
      case 'warning':
        return 'text-yellow-600 focus:ring-yellow-500';
      case 'danger':
        return 'text-red-600 focus:ring-red-500';
      default:
        return 'text-gray-600 focus:ring-gray-500';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded border-gray-300 
          focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
      {label && (
        <label 
          htmlFor={id} 
          className={`ml-2 text-sm font-medium text-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
