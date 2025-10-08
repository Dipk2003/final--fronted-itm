'use client';

import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  onClick
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'h-6 w-6 text-xs';
      case 'sm':
        return 'h-8 w-8 text-sm';
      case 'lg':
        return 'h-12 w-12 text-lg';
      case 'xl':
        return 'h-16 w-16 text-xl';
      case '2xl':
        return 'h-20 w-20 text-2xl';
      default:
        return 'h-10 w-10 text-base';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const fallbackDiv = parent.querySelector('.avatar-fallback');
      if (fallbackDiv) {
        (fallbackDiv as HTMLElement).style.display = 'flex';
      }
    }
  };

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center 
        ${getSizeClasses()} 
        rounded-full bg-gray-300 text-gray-700 
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
          onError={handleImageError}
        />
      )}
      <div 
        className={`
          avatar-fallback absolute inset-0 flex items-center justify-center 
          rounded-full bg-gray-300 text-gray-700 font-medium
          ${src ? 'hidden' : 'flex'}
        `}
      >
        {fallback ? getInitials(fallback) : alt.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
