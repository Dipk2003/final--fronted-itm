'use client';

import React, { useState, useCallback } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  disabled?: boolean;
  className?: string;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
  showValues?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
  className = '',
  formatLabel = (val) => val.toString(),
  showLabels = true,
  showValues = true
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const getPercentage = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const getValue = useCallback((percentage: number) => {
    const val = min + (percentage / 100) * (max - min);
    return Math.round(val / step) * step;
  }, [min, max, step]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1]);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0]);
    onChange([value[0], newMax]);
  };

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      )}
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full relative">
          {/* Active track */}
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
          />
        </div>

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          step={step}
          onChange={handleMinChange}
          disabled={disabled}
          className={`
            absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{ zIndex: 1 }}
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          step={step}
          onChange={handleMaxChange}
          disabled={disabled}
          className={`
            absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{ zIndex: 2 }}
        />

        {/* Min thumb */}
        <div
          className={`
            absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full 
            transform -translate-x-1/2 -translate-y-1
            ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-blue-600'}
          `}
          style={{
            left: `${minPercentage}%`,
            zIndex: 3
          }}
        />

        {/* Max thumb */}
        <div
          className={`
            absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full 
            transform -translate-x-1/2 -translate-y-1
            ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-blue-600'}
          `}
          style={{
            left: `${maxPercentage}%`,
            zIndex: 3
          }}
        />
      </div>

      {showValues && (
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-600">Min: </span>
            <span className="font-medium">{formatLabel(value[0])}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Max: </span>
            <span className="font-medium">{formatLabel(value[1])}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
