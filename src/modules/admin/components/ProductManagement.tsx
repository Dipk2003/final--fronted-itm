'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  subCategory: string;
  vendorId: number;
  vendorName: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  imageUrl: string;
  totalSales: number;
  averageRating: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error: any) {
      setError('Failed to fetch products: ' + error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data.map((cat: any) => cat.name));
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/products/${productId}/status`, {
        isActive: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error: any) {
      setError('Failed to update product status: ' + error.message);
    }
  };

  const approveProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/products/${productId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error: any) {
      setError('Failed to approve product: ' + error.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && product.isActive) ||
                         (filterStatus === 'INACTIVE' && !product.isActive) ||
                         (filterStatus === 'PENDING' && !product.isApproved) ||
                         (filterStatus === 'APPROVED' && product.isApproved);
    
    const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (isActive: boolean, isApproved: boolean) => {
    if (!isApproved) return 'bg-yellow-100 text-yellow-800';
    if (isActive) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean, isApproved: boolean) => {
    if (!isApproved) return 'Pending';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={product.imageUrl || '/placeholder-image.jpg'} 
                      alt={product.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category} - {product.subCategory}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.vendorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${getStockColor(product.stockQuantity)}`}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.isActive, product.isApproved)}`}>
                    {getStatusText(product.isActive, product.isApproved)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.totalSales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-yellow-400">{getRatingStars(product.averageRating)}</span>
                    <span className="ml-1">({product.averageRating.toFixed(1)})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className={`${product.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {!product.isApproved && (
                    <button
                      onClick={() => approveProduct(product.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria.
        </div>
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Product Details: {selectedProduct.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <img 
                    src={selectedProduct.imageUrl || '/placeholder-image.jpg'} 
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold mb-2">Product Information</h4>
                  <p><strong>Name:</strong> {selectedProduct.name}</p>
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Sub-Category:</strong> {selectedProduct.subCategory}</p>
                  <p><strong>Price:</strong> ₹{selectedProduct.price.toLocaleString()}</p>
                  <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Vendor & Performance</h4>
                  <p><strong>Vendor:</strong> {selectedProduct.vendorName}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedProduct.isActive, selectedProduct.isApproved)}</p>
                  <p><strong>Total Sales:</strong> {selectedProduct.totalSales}</p>
                  <p><strong>Average Rating:</strong> {getRatingStars(selectedProduct.averageRating)} ({selectedProduct.averageRating.toFixed(1)})</p>
                  <p><strong>Added:</strong> {new Date(selectedProduct.createdAt).toLocaleString()}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Total Sales</p>
                        <p className="text-xl font-bold text-blue-600">{selectedProduct.totalSales}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Stock Level</p>
                        <p className={`text-xl font-bold ${getStockColor(selectedProduct.stockQuantity)}`}>
                          {selectedProduct.stockQuantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
