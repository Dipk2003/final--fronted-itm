'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface BulkOperationsProps {
  type: 'products' | 'orders';
  onSuccess?: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  type,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/bulk/${type}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`Successfully processed ${response.data.successCount} items`);
      if (response.data.errorCount > 0) {
        console.error('Errors:', response.data.errors);
        toast.error(`Failed to process ${response.data.errorCount} items`);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = `/templates/${type}_template.xlsx`;
    link.download = `${type}_template.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/bulk/${type}/export`,
        {
          params: { ids: selectedIds },
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_export.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (!action || selectedIds.length === 0) {
      toast.error('Please select items and an action');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/bulk/${type}/process`,
        {
          ids: selectedIds,
          action
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`Successfully processed ${response.data.successCount} items`);
      if (response.data.errorCount > 0) {
        console.error('Errors:', response.data.errors);
        toast.error(`Failed to process ${response.data.errorCount} items`);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Process error:', error);
      toast.error('Failed to process items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold mb-4">Bulk Operations</h2>
        
        {/* Upload Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold">Upload Data</h3>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Download Template
            </button>
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold">Export Data</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Exporting...' : 'Export Selected'}
            </button>
          </div>
        </div>

        {/* Bulk Actions Section */}
        {type === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bulk Actions</h3>
            <div className="flex items-center space-x-4">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Select Action</option>
                <option value="confirm">Confirm</option>
                <option value="ship">Ship</option>
                <option value="deliver">Deliver</option>
                <option value="cancel">Cancel</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={loading || !action || selectedIds.length === 0}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Apply to Selected'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
