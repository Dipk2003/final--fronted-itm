'use client';

import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
  className?: string;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
  showValue?: boolean;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
  className = '',
  formatLabel = (val) => val.toString(),
  showLabels = true,
  showValue = true,
  label
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      
      {showLabels && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      )}
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full relative">
          {/* Progress */}
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          className={`
            absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />

        {/* Thumb */}
        <div
          className={`
            absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full 
            transform -translate-x-1/2 -translate-y-1
            ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-blue-600'}
          `}
          style={{
            left: `${percentage}%`,
            zIndex: 1
          }}
        />
      </div>

      {showValue && (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700">
            {formatLabel(value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Slider;
