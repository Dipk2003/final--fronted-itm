'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { api, testAuthAndGetUser, findBulkImportEndpoint } from '@/lib/api';
import { Button } from '@/shared/components/Button';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ExcelImportResponse {
  success: boolean;
  message: string;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  importedProducts: any[];
}

interface ExcelImportProps {
  onImportSuccess?: (response: ExcelImportResponse) => void;
  onProductsUpdated?: () => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImportSuccess, onProductsUpdated }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ExcelImportResponse | null>(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Debug user authentication
  console.log('Current user:', user);
  console.log('User ID:', user?.id);
  console.log('AuthToken:', localStorage.getItem('authToken'));
  console.log('Token:', localStorage.getItem('token'));
  
  // Fallback user for testing if auth fails
  const effectiveUser = user || {
    id: '2',  // Using vendor ID 2 as it exists in the database
    email: 'test@example.com',
    name: 'Test Vendor',
    role: 'vendor' as const,
    userType: 'vendor' as const,
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
  };

  const handleImport = async (e?: React.FormEvent) => {
    // Prevent default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!selectedFile) {
      console.error('No file selected');
      alert('Please select a file first.');
      return;
    }

    console.log('Starting import for:', selectedFile.name);
    console.log('Using user:', effectiveUser);
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.log('❌ No authentication token found');
      setImportResult({
        success: false,
        message: 'Please log in to import products.',
        totalRows: 0,
        successfulImports: 0,
        failedImports: 0,
        errors: ['Authentication required - please log in'],
        importedProducts: []
      });
      return;
    }
    console.log('✅ Authentication token found:', token.substring(0, 20) + '...');

    setImporting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Use the correct Excel import endpoint
      const endpoint = `/api/excel/import/${effectiveUser.id}`;
      
      console.log(`Using Excel import endpoint: ${endpoint}`);
      console.log('FormData contents:', { fileName: selectedFile.name, fileSize: selectedFile.size });
      
      // Get the auth token
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      console.log('Using token:', token ? token.substring(0, 20) + '...' : 'No token found');
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        timeout: 60000, // 60 seconds for large files
      });
      
      console.log('Excel import response:', response.data);
      setImportResult(response.data);
      onImportSuccess?.(response.data);
      
      // Refresh product list if import was successful
      if (response.data.success) {
        onProductsUpdated?.();
      }
    } catch (error: any) {
      console.error('Import error:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Enhanced error handling for different types of network issues
      if (error.code === 'ECONNREFUSED' || 
          error.code === 'ENOTFOUND' || 
          error.code === 'ETIMEDOUT' ||
          error.message === 'Network Error' || 
          error.message?.includes('timeout') ||
          !error.response) {
        
        console.log('Network connectivity issue detected. Error details:', {
          code: error.code,
          message: error.message,
          config: error.config?.url
        });
        
        // Provide user-friendly error message
        setImportResult({
          success: false,
          message: 'Unable to connect to the server. Please check your internet connection and try again. If the problem persists, the backend server may be unavailable.',
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          errors: [
            'Network connection failed',
            'Please ensure the backend server is running on http://localhost:8080',
            'Check your internet connection and firewall settings'
          ],
          importedProducts: []
        });
      } else if (error.response?.status === 403) {
        setImportResult({
          success: false,
          message: 'Access denied. Please check your authentication credentials.',
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          errors: ['Authentication failed - please log in again'],
          importedProducts: []
        });
      } else if (error.response?.status === 404) {
        setImportResult({
          success: false,
          message: 'Import endpoint not found. Please check the API configuration.',
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          errors: ['API endpoint not found'],
          importedProducts: []
        });
      } else if (error.response?.status >= 500) {
        setImportResult({
          success: false,
          message: 'Server error occurred. Please try again later.',
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          errors: [error.response?.data?.message || 'Internal server error'],
          importedProducts: []
        });
      } else {
        setImportResult({
          success: false,
          message: error.response?.data?.message || 'Import failed',
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          errors: [error.response?.data?.message || 'Import failed'],
          importedProducts: []
        });
      }
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = async () => {
    console.log('Attempting to download template');
    setTemplateLoading(true);
    
    try {
      // Use the new template endpoint
      const response = await api.get('/api/excel/template', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product_import_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Template downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading template:', error);
      
      // Show error message if template cannot be downloaded
      alert('Unable to download template. Please contact support.');
    } finally {
      setTemplateLoading(false);
    }
  };

  const downloadCSV = async () => {
    console.log('Attempting to download CSV');
    console.log('Using user:', effectiveUser);
    
    try {
      const response = await api.get(`/vendor/vendors/${effectiveUser.id}/products/export`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products_export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading CSV:', error);
      
      console.error('Error details:', error.response?.status, error.response?.data);
      alert('Failed to download CSV. Please check your connection or contact support.');
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Product Import</h2>
          <p className="text-gray-600">Upload multiple products using Excel or CSV file</p>
        </div>
        <FileSpreadsheet className="h-8 w-8 text-green-600" />
      </div>

      {/* Download Options */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-4">Download Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Download Template</h4>
              <p className="text-sm text-blue-700">
                Download our Excel template to ensure proper formatting
              </p>
            </div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              loading={templateLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 ml-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Download Products CSV</h4>
              <p className="text-sm text-blue-700">
                Export current products list in CSV format
              </p>
            </div>
            <Button
              variant="outline"
              onClick={downloadCSV}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 ml-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Excel File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <div className="mb-4">
              <label htmlFor="excel-file" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
                <input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Excel files (.xlsx, .xls) or CSV files up to 10MB
            </p>
          </div>
        </div>
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={resetImport}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Instructions */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">
          <AlertCircle className="inline h-4 w-4 mr-1" />
          Import Instructions
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use the provided template for best results</li>
          <li>• Ensure all required fields are filled (Product Name, Price, Stock, Category)</li>
          <li>• Category names must match existing categories</li>
          <li>• Prices should be in numeric format without currency symbols</li>
          <li>• Stock quantities must be whole numbers</li>
          <li>• Maximum 500 products per import</li>
        </ul>
      </div>

      {/* Import Button */}
      <div className="flex justify-center mb-6">
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleImport(e);
          }}
          disabled={!selectedFile || importing}
          loading={importing}
          size="lg"
          className="px-8"
        >
          <Upload className="h-5 w-5 mr-2" />
          {importing ? 'Importing Products...' : 'Import Products'}
        </Button>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="mt-6 p-4 rounded-lg border">
          <div className="flex items-center mb-4">
            {importResult.success ? (
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 mr-2" />
            )}
            <h3 className="font-medium text-lg">
              {importResult.success ? 'Import Completed' : 'Import Failed'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {importResult.totalRows}
              </div>
              <div className="text-sm text-blue-700">Total Rows</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {importResult.successfulImports}
              </div>
              <div className="text-sm text-green-700">Successfully Imported</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {importResult.failedImports}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {importResult.message}
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {importResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {importResult.success && (
            <div className="mt-4 flex justify-center">
              <Button onClick={resetImport} variant="outline">
                Import Another File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
