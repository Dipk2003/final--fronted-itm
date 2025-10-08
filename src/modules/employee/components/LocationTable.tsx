'use client';

import React from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { State, City } from '../types/employee';

interface LocationTableProps {
  data: State[] | City[];
  type: 'states' | 'cities';
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: State | City) => void;
  onDelete: (itemId: string) => void;
  onToggleStatus: (itemId: string) => void;
  allStates: State[];
}

export default function LocationTable({ 
  data, 
  type, 
  loading, 
  page, 
  totalPages, 
  onPageChange, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  allStates
}: LocationTableProps) {

  const getStateName = (stateId: string) => {
    const state = allStates.find(s => s.id === stateId);
    return state ? state.name : 'Unknown';
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'states' ? 'State' : 'City'}
              </th>
              {type === 'states' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
              )}
              {type === 'cities' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
              )}
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
                <td colSpan={type === 'states' ? 6 : 6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={type === 'states' ? 6 : 6} className="px-6 py-12 text-center text-gray-500">
                  No {type} found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {type === 'states' && (
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {(item as State).code}
                    </td>
                  )}
                  
                  {type === 'cities' && (
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getStateName((item as City).stateId)}
                    </td>
                  )}
                  
                  <td className="px-6 py-4">
                    <Badge variant={item.isActive ? 'success' : 'secondary'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.sortOrder}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={item.isActive ? 'secondary' : 'default'}
                      onClick={() => onToggleStatus(item.id)}
                    >
                      {item.isActive ? '🚫' : '✅'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(item.id)}
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
}
