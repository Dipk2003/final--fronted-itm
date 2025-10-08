'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { createState, updateState, createCity, updateCity } from '../services/locationManagementApi';
import { State, City, LocationFormData } from '../types/employee';

interface LocationFormProps {
  item?: State | City | null;
  type: 'state' | 'city';
  onClose: () => void;
  states: State[];
  isMobile?: boolean;
}

export default function LocationForm({ item, type, onClose, states, isMobile = false }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    code: '',
    stateId: '',
    isActive: true,
    sortOrder: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      if (type === 'state') {
        const state = item as State;
        setFormData({
          name: state.name,
          code: state.code,
          stateId: '',
          isActive: state.isActive,
          sortOrder: state.sortOrder
        });
      } else {
        const city = item as City;
        setFormData({
          name: city.name,
          code: '',
          stateId: city.stateId,
          isActive: city.isActive,
          sortOrder: city.sortOrder
        });
      }
    }
  }, [item, type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        sortOrder: Number(formData.sortOrder)
      };

      if (type === 'state') {
        if (item) {
          await updateState(item.id, submitData);
        } else {
          await createState(submitData);
        }
      } else {
        if (item) {
          await updateCity(item.id, submitData);
        } else {
          await createCity(submitData);
        }
      }
      
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || `Failed to save ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <Input
          label={`${type === 'state' ? 'State' : 'City'} Name`}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder={type === 'state' ? 'e.g., Karnataka, Maharashtra' : 'e.g., Bangalore, Mumbai'}
        />

        {type === 'state' && (
          <Input
            label="State Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            placeholder="e.g., KA, MH"
            maxLength={3}
          />
        )}

        {type === 'city' && (
          <div>
            <Select
              label="State"
              value={formData.stateId}
              onChange={(e) => handleSelectChange('stateId', e.target.value)}
              options={[
                { value: '', label: 'Select State' },
                ...(states.map(state => ({ value: state.id, label: state.name })))
              ]}
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Sort Order"
          name="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={handleInputChange}
          min="0"
          placeholder="0"
        />

        <div className="flex items-center justify-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {item ? `Update ${type === 'state' ? 'State' : 'City'}` : `Create ${type === 'state' ? 'State' : 'City'}`}
        </Button>
      </div>
    </form>
  );
}
