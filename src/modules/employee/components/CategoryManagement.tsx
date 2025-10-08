'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';
import { 
  getAllCategories, 
  getCategoriesPaginated, 
  getMainCategories,
  getSubcategories,
  getMicrocategories,
  searchCategories,
  deleteCategory,
  toggleCategoryStatus
} from '../services/categoryManagementApi';
import { Category } from '../types/employee';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'main' | 'sub' | 'micro'>('all');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'hierarchy'>('table');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      if (viewMode === 'hierarchy') {
        const data = await getAllCategories();
        setCategories(data);
      } else {
        const levelParam = selectedLevel === 'all' ? undefined : selectedLevel;
        const result = await getCategoriesPaginated(page, size, levelParam, selectedParentId || undefined, searchQuery || undefined);
        setCategories(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedLevel, page, size, selectedParentId, searchQuery]);

  const loadMainCategories = useCallback(async () => {
    try {
      const data = await getMainCategories();
      setParentCategories(data);
    } catch (error) {
      console.error('Failed to load main categories:', error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadMainCategories();
  }, [page, size, selectedLevel, selectedParentId, viewMode, searchQuery, loadCategories, loadMainCategories]);

  const loadSubcategories = async (parentId: string) => {
    try {
      const data = await getSubcategories(parentId);
      setSubCategories(data);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setPage(0);
      const levelParam = selectedLevel === 'all' ? undefined : selectedLevel;
      const data = await searchCategories(searchQuery, levelParam);
      setCategories(data);
    } catch (error) {
      console.error('Failed to search categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedParentId(null);
    setPage(0);
    loadCategories();
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level as 'all' | 'main' | 'sub' | 'micro');
    setSelectedParentId(null);
    setPage(0);
  };

  const handleParentChange = (parentId: string) => {
    setSelectedParentId(parentId || null);
    setPage(0);
    if (parentId) {
      loadSubcategories(parentId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
    loadCategories();
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        loadCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      } finally {
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      await toggleCategoryStatus(categoryId);
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600 mt-1">Manage product categories that appear throughout the website</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setViewMode(viewMode === 'table' ? 'hierarchy' : 'table')}
            variant="outline"
          >
            {viewMode === 'table' ? '🌳 Hierarchy View' : '📊 Table View'}
          </Button>
          <Button onClick={handleAddNew}>
            ➕ Add New Category
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              label="Search"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              label="Level"
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Levels' },
                { value: 'main', label: 'Main Categories' },
                { value: 'sub', label: 'Subcategories' },
                { value: 'micro', label: 'Micro Categories' },
              ]}
            />
          </div>
          {(selectedLevel === 'sub' || selectedLevel === 'micro') && (
            <div className="w-full md:w-64">
              <Select
                label="Parent Category"
                value={selectedParentId || ''}
                onChange={(e) => handleParentChange(e.target.value)}
                options={[
                  { value: '', label: 'Select Parent' },
                  ...(parentCategories.map(cat => ({ value: cat.id, label: cat.name })))
                ]}
              />
            </div>
          )}
          {selectedLevel === 'micro' && selectedParentId && (
            <div className="w-full md:w-64">
              <Select
                label="Subcategory"
                value={selectedParentId || ''}
                onChange={(e) => handleParentChange(e.target.value)}
                options={[
                  { value: '', label: 'Select Subcategory' },
                  ...(subCategories.map(cat => ({ value: cat.id, label: cat.name })))
                ]}
              />
            </div>
          )}
          <div className="flex items-end space-x-2">
            <Button onClick={handleSearch} variant="secondary">
              🔍 Search
            </Button>
            <Button onClick={handleClearFilters} variant="outline">
              ↻ Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
        viewMode={viewMode}
      />

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={handleFormClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CategoryForm
                category={editingCategory}
                onClose={handleFormClose}
                parentCategories={parentCategories}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCategoryToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
