'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { productAPI, Product } from '@/shared/services/productApi';
import { Button } from '@/shared/components/Button';
import ImageManager from './ImageManager';
import { Edit, Trash2, Eye, ToggleLeft, ToggleRight, Plus, Image as ImageIcon } from 'lucide-react';

interface ProductListProps {
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  searchTerm?: string;
  selectedCategory?: string;
}

const ProductList: React.FC<ProductListProps> = ({ onAddProduct, onEditProduct, searchTerm = '', selectedCategory = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isApiDown, setIsApiDown] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductForImages, setSelectedProductForImages] = useState<Product | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);

  // Enable automatic loading to show products on dashboard
  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading products from API...');
      const response = await productAPI.getMyProducts(0, 1000); // Get all products for filtering
      console.log('✅ Products loaded:', response);
      console.log('📊 Products count:', response.content?.length || 0);
      
      // Debug each product's image data
      response.content?.forEach((product, index) => {
        console.log(`📋 Product ${index + 1}: ${product.name}`);
        console.log(`   🆔 ID: ${product.id}`);
        console.log(`   📸 Images array:`, product.images);
        console.log(`   🔗 ImageUrls string:`, product.imageUrls);
        console.log(`   🖼️ Has images:`, (product.images?.length || 0) + (product.imageUrls ? product.imageUrls.split(',').filter(u => u.trim()).length : 0));
      });
      
      setAllProducts(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      console.error('❌ Error loading products:', error);
      
      // For now, set empty products to prevent app crash
      setAllProducts([]);
      setTotalElements(0);
      
      // Show user-friendly error
      if (error.response?.status === 400) {
        console.warn('API endpoint may not be available. Using mock data for development.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = React.useMemo(() => {
    let filtered = allProducts;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory.trim()) {
      filtered = filtered.filter(product =>
        product.category?.name === selectedCategory
      );
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory]);

  // Update products for display with pagination
  React.useEffect(() => {
    const startIndex = page * 10;
    const endIndex = startIndex + 10;
    setProducts(filteredProducts.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredProducts.length / 10));
  }, [filteredProducts, page]);

  const handleToggleStatus = async (productId: number, currentStatus: boolean) => {
    try {
      await productAPI.updateProductStatus(productId, !currentStatus);
      await loadProducts(); // Refresh the list
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.deleteProduct(productId);
      await loadProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const getStatusBadge = (product: Product) => {
    if (!product.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    }
    
    switch (product.status) {
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'PENDING':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'OUT_OF_STOCK':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Helper function to convert relative URLs to absolute URLs
  const getAbsoluteImageUrl = (url: string): string => {
    if (!url) return url;
    
    // If it's already an absolute URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL starting with /, prepend backend URL
    if (url.startsWith('/')) {
      return `http://localhost:8080${url}`;
    }
    
    // If it's a relative URL without /, prepend backend URL with /
    return `http://localhost:8080/${url}`;
  };

  const getImageUrl = (product: Product) => {
    // First try to get image from images array
    if (product.images && product.images.length > 0) {
      return getAbsoluteImageUrl(product.images[0].imageUrl);
    }
    
    // Then try to get from imageUrls string (comma-separated URLs)
    if (product.imageUrls && product.imageUrls.trim()) {
      const urls = product.imageUrls.split(',').filter(url => url.trim());
      if (urls.length > 0) {
        return getAbsoluteImageUrl(urls[0].trim());
      }
    }
    
    // Fallback to SVG placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  };
  
  const getAllImageUrls = (product: Product): string[] => {
    const urls: string[] = [];
    
    // Get from images array
    if (product.images && product.images.length > 0) {
      urls.push(...product.images.map(img => img.imageUrl));
    }
    
    // Get from imageUrls string
    if (product.imageUrls && product.imageUrls.trim()) {
      const stringUrls = product.imageUrls.split(',').filter(url => url.trim()).map(url => url.trim());
      urls.push(...stringUrls);
    }
    
    return [...new Set(urls)]; // Remove duplicates
  };
  
  const handleManageImages = (product: Product) => {
    setSelectedProductForImages(product);
    setShowImageManager(true);
  };
  
  const handleImageUpdate = (updatedProduct: Product) => {
    // Update the product in the local state
    setAllProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };
  
  const handleCloseImageManager = () => {
    setShowImageManager(false);
    setSelectedProductForImages(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <p className="text-gray-600">{totalElements} products total</p>
        </div>
        {onAddProduct && (
          <Button onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
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
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <Image
                          className="rounded-lg object-cover"
                          src={getImageUrl(product)}
                          alt={product.name || 'Product Image'}
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.price}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.viewCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(product.id, product.isActive || false)}
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManageImages(product)}
                        title="Manage Images"
                      >
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                      </Button>
                      
                      {onEditProduct && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {totalElements === 0 ? "No products found. Start by adding your first product!" : "Click 'Refresh' to load your products"}
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={loadProducts} loading={loading}>
                🔄 Refresh Products
              </Button>
              {onAddProduct && (
                <Button onClick={onAddProduct} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{page * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min((page + 1) * 10, totalElements)}</span> of{' '}
                <span className="font-medium">{totalElements}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="rounded-l-md"
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page < 3 ? i : page - 2 + i;
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="rounded-none"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded-r-md"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Manager Modal */}
      {showImageManager && selectedProductForImages && (
        <ImageManager
          product={selectedProductForImages}
          onClose={handleCloseImageManager}
          onImageUpdate={handleImageUpdate}
        />
      )}
    </div>
  );
};

export default ProductList;
