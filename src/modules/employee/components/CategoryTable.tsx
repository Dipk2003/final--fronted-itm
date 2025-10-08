'use client';

import React from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Category } from '../types/employee';

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
  viewMode: 'table' | 'hierarchy';
}

export default function CategoryTable({ 
  categories, 
  loading, 
  page, 
  size, 
  totalPages, 
  onPageChange, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  viewMode
}: CategoryTableProps) {

  const renderHierarchyView = () => {
    const mainCategories = categories.filter(cat => cat.level === 'main');
    
    return (
      <Card className="overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Hierarchy</h3>
          <div className="space-y-4">
            {mainCategories.map(mainCategory => (
              <div key={mainCategory.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📁</span>
                    <span className="font-medium text-lg">{mainCategory.name}</span>
                    <Badge variant={mainCategory.isActive ? 'success' : 'secondary'}>
                      {mainCategory.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(mainCategory)}>
                      ✏️ Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant={mainCategory.isActive ? 'secondary' : 'default'}
                      onClick={() => onToggleStatus(mainCategory.id)}
                    >
                      {mainCategory.isActive ? '🚫 Deactivate' : '✅ Activate'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(mainCategory.id)}>
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
                
                {/* Subcategories */}
                {mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {mainCategory.subcategories.map(subCategory => (
                      <div key={subCategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">📂</span>
                          <span className="text-sm font-medium">{subCategory.name}</span>
                          <Badge variant={subCategory.isActive ? 'success' : 'secondary'}>
                            {subCategory.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => onEdit(subCategory)}>
                            ✏️
                          </Button>
                          <Button 
                            size="sm" 
                            variant={subCategory.isActive ? 'secondary' : 'default'}
                            onClick={() => onToggleStatus(subCategory.id)}
                          >
                            {subCategory.isActive ? '🚫' : '✅'}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(subCategory.id)}>
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderTableView = () => {
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {category.icon && (
                          <span className="mr-2 text-lg">{category.icon}</span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500">
                              {category.description.length > 50 
                                ? `${category.description.substring(0, 50)}...`
                                : category.description
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          category.level === 'main' ? 'default' :
                          category.level === 'sub' ? 'secondary' : 'outline'
                        }
                      >
                        {category.level === 'main' ? 'Main' : 
                         category.level === 'sub' ? 'Sub' : 'Micro'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={category.isActive ? 'success' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {category.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(category)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={category.isActive ? 'secondary' : 'default'}
                        onClick={() => onToggleStatus(category.id)}
                      >
                        {category.isActive ? '🚫' : '✅'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(category.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page + 1}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => onPageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="rounded-r-none"
                  >
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        onClick={() => onPageChange(pageNum)}
                        className="rounded-none"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="rounded-l-none"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return viewMode === 'hierarchy' ? renderHierarchyView() : renderTableView();
}
