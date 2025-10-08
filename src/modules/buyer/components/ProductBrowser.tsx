'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star, MapPin } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  vendor: {
    id: number;
    name: string;
    location: string;
    rating: number;
  };
  category: string;
  subCategory?: string;
  location: {
    city: string;
    state: string;
  };
  isInWishlist?: boolean;
  isInCart?: boolean;
  rating: number;
  reviewCount: number;
  minOrderQuantity: number;
}

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  sortBy: 'price_low' | 'price_high' | 'newest' | 'rating';
}

export default function ProductBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    location: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error fetching products:', err);
      
      // Fallback mock data for development
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Premium Cotton T-Shirts',
          description: 'High-quality cotton t-shirts in bulk quantities. Perfect for retail or corporate use.',
          price: 250,
          originalPrice: 350,
          images: ['/api/placeholder/300/300'],
          vendor: {
            id: 101,
            name: 'Fashion Hub India',
            location: 'Mumbai, Maharashtra',
            rating: 4.5
          },
          category: 'Clothing',
          subCategory: 'T-Shirts',
          location: {
            city: 'Mumbai',
            state: 'Maharashtra'
          },
          isInWishlist: false,
          isInCart: false,
          rating: 4.3,
          reviewCount: 127,
          minOrderQuantity: 50
        },
        {
          id: 2,
          name: 'Stainless Steel Kitchen Utensils Set',
          description: 'Complete kitchen utensils set made from high-grade stainless steel.',
          price: 1500,
          originalPrice: 2000,
          images: ['/api/placeholder/300/300'],
          vendor: {
            id: 102,
            name: 'Kitchen Pro Solutions',
            location: 'Delhi, Delhi',
            rating: 4.7
          },
          category: 'Kitchen',
          subCategory: 'Utensils',
          location: {
            city: 'Delhi',
            state: 'Delhi'
          },
          isInWishlist: true,
          isInCart: false,
          rating: 4.6,
          reviewCount: 89,
          minOrderQuantity: 10
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location) {
      filtered = filtered.filter(product => 
        product.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        product.location.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, isInWishlist: !product.isInWishlist }
            : product
        ));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const addToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, isInCart: true }
            : product
        ));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Clothing">Clothing</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Garden">Home & Garden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 100000 }))}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="City or State"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  product.isInWishlist ? 'bg-red-100 text-red-600' : 'bg-white text-gray-400'
                } hover:bg-red-100 hover:text-red-600 transition-colors`}
              >
                <Heart className="w-5 h-5" fill={product.isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{product.location.city}, {product.location.state}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Min: {product.minOrderQuantity} pcs
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={product.isInCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    product.isInCart
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.isInCart ? 'Added' : 'Add to Cart'}
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact
                </button>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium">{product.vendor.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    <span>{product.vendor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}