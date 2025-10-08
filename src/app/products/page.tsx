'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Search, Filter, Grid, List, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  vendor: string;
  stock: number;
}

export default function ProductsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  // Sample products data - replace with API call
  const sampleProducts = useMemo<Product[]>(() => [
    {
      id: 1,
      name: "Premium Laptop",
      price: 45000,
      image: "/api/placeholder/300/200",
      description: "High-performance laptop for business use",
      category: "Electronics",
      rating: 4.5,
      vendor: "Tech Solutions Ltd",
      stock: 10
    },
    {
      id: 2,
      name: "Office Chair",
      price: 8500,
      image: "/api/placeholder/300/200",
      description: "Ergonomic office chair with lumbar support",
      category: "Furniture",
      rating: 4.2,
      vendor: "Office Furniture Co",
      stock: 25
    },
    {
      id: 3,
      name: "Industrial Printer",
      price: 25000,
      image: "/api/placeholder/300/200",
      description: "Heavy-duty printer for industrial use",
      category: "Electronics",
      rating: 4.8,
      vendor: "Print Solutions Inc",
      stock: 5
    },
    {
      id: 4,
      name: "Safety Helmet",
      price: 1200,
      image: "/api/placeholder/300/200",
      description: "Industrial safety helmet with certification",
      category: "Safety",
      rating: 4.0,
      vendor: "Safety First Ltd",
      stock: 100
    }
  ], []);

  const categories = ["All", "Electronics", "Furniture", "Safety", "Tools", "Materials"];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, [sampleProducts]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const addToCart = (product: Product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    // Add to cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category || (category === 'All' && selectedCategory === '')}
                      onChange={(e) => setSelectedCategory(e.target.value === 'All' ? '' : e.target.value)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Search and View Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">by {product.vendor}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
