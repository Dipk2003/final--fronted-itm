'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { createCategory, updateCategory, getSubcategories } from '../services/categoryManagementApi';
import { Category, CategoryFormData } from '../types/employee';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  parentCategories: Category[];
}

export default function CategoryForm({ category, onClose, parentCategories }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    level: 'main',
    isActive: true,
    sortOrder: 0,
    icon: '',
    image: '',
    seoTitle: '',
    seoDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parentId: category.parentId || '',
        level: category.level,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        icon: category.icon || '',
        image: category.image || '',
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || ''
      });
    }
  }, [category]);

  useEffect(() => {
    if (formData.level === 'micro' && formData.parentId) {
      loadSubcategories(formData.parentId);
    }
  }, [formData.level, formData.parentId]);

  const loadSubcategories = async (parentId: string) => {
    try {
      const data = await getSubcategories(parentId);
      setSubCategories(data);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name' && !category) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset parentId when level changes to main
    if (name === 'level' && value === 'main') {
      setFormData(prev => ({
        ...prev,
        parentId: ''
      }));
    }

    // Load subcategories when switching to micro level
    if (name === 'parentId' && formData.level === 'micro' && value) {
      loadSubcategories(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        parentId: formData.parentId || undefined,
        sortOrder: Number(formData.sortOrder)
      };

      if (category) {
        await updateCategory(category.id, submitData);
      } else {
        await createCategory(submitData);
      }
      
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save category');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="e.g., Electronics, Smartphones"
        />

        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          placeholder="e.g., electronics, smartphones"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Brief description of the category"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            label="Level"
            value={formData.level}
            onChange={(e) => handleSelectChange('level', e.target.value)}
            options={[
              { value: 'main', label: 'Main Category' },
              { value: 'sub', label: 'Subcategory' },
              { value: 'micro', label: 'Micro Category' },
            ]}
          />
        </div>

        {(formData.level === 'sub' || formData.level === 'micro') && (
          <div>
            <Select
              label={formData.level === 'sub' ? 'Parent Category' : 'Parent Category (Main)'}
              value={formData.parentId}
              onChange={(e) => handleSelectChange('parentId', e.target.value)}
              options={[
                { value: '', label: 'Select Parent' },
                ...(parentCategories.map(cat => ({ value: cat.id, label: cat.name })))
              ]}
              required
            />
          </div>
        )}

        {formData.level === 'micro' && formData.parentId && (
          <div>
            <Select
              label="Parent Subcategory"
              value={formData.parentId}
              onChange={(e) => handleSelectChange('parentId', e.target.value)}
              options={[
                { value: '', label: 'Select Subcategory' },
                ...(subCategories.map(cat => ({ value: cat.id, label: cat.name })))
              ]}
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Icon"
          name="icon"
          value={formData.icon}
          onChange={handleInputChange}
          placeholder="📱 (emoji or icon class)"
        />

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

      <div>
        <Input
          label="Image URL (optional)"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="https://example.com/category-image.jpg"
        />
      </div>

      {/* SEO Section */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>
        <div className="space-y-4">
          <Input
            label="SEO Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            placeholder="SEO optimized title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="Meta description for search engines"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
