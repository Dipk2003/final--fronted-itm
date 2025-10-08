'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/shared/components';
import { Search, Filter, MapPin, ArrowLeft, Grid, List, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  vendorCount: number;
}

interface Category {
  name: string;
  products: Product[];
}

const CityProductsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const city = params?.city as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cityName = city ? decodeURIComponent(city).charAt(0).toUpperCase() + decodeURIComponent(city).slice(1).toLowerCase() : '';

  // Mock data - replace with API call
  const mockCategories = useMemo<Category[]>(() => [
    {
      name: 'Building Construction Material & Equipment',
      products: [
        {
          id: '1',
          name: 'Prefabricated Houses',
          category: 'Building & Construction',
          subcategory: 'Prefabricated Structures',
          image: '/api/placeholder/300/200',
          description: 'High-quality prefabricated houses, scaffolding planks & plates, construction machines, crushing machines & plants',
          vendorCount: 15
        },
        {
          id: '2',
          name: 'Brick Making Machines',
          category: 'Building & Construction',
          subcategory: 'Construction Machinery',
          image: '/api/placeholder/300/200',
          description: 'Fly Ash Brick Making Machine, Clay Brick Making Machine, Cement Brick Making Machine',
          vendorCount: 8
        },
        {
          id: '3',
          name: 'Passenger Lifts',
          category: 'Building & Construction',
          subcategory: 'Elevators & Lifts',
          image: '/api/placeholder/300/200',
          description: 'Residential Elevator, Kone Passenger lift, Stair Lift',
          vendorCount: 12
        },
        {
          id: '4',
          name: 'TMT Bars',
          category: 'Building & Construction',
          subcategory: 'Steel Products',
          image: '/api/placeholder/300/200',
          description: 'TMT Steel Bars, TATA TMT Bars, Kamdhenu TMT Bars',
          vendorCount: 20
        },
        {
          id: '5',
          name: 'Plywoods',
          category: 'Building & Construction',
          subcategory: 'Wood Products',
          image: '/api/placeholder/300/200',
          description: 'Shuttering Plywood, Laminated Plywood, Waterproof Plywood',
          vendorCount: 18
        },
        {
          id: '6',
          name: 'Excavator',
          category: 'Building & Construction',
          subcategory: 'Heavy Machinery',
          image: '/api/placeholder/300/200',
          description: 'Hitachi Excavator, Hyundai Excavator, Komatsu Excavator',
          vendorCount: 10
        },
        {
          id: '7',
          name: 'Emulsion Paints',
          category: 'Building & Construction',
          subcategory: 'Paints & Coatings',
          image: '/api/placeholder/300/200',
          description: 'Asian Emulsion Paints, Berger Emulsion Paints, Nerolac Emulsion Paints',
          vendorCount: 25
        },
        {
          id: '8',
          name: 'Wooden Door',
          category: 'Building & Construction',
          subcategory: 'Doors & Windows',
          image: '/api/placeholder/300/200',
          description: 'Designer Wooden Door, Plywood Door, Wooden Flush Doors',
          vendorCount: 14
        },
        {
          id: '9',
          name: 'PVC Pipes',
          category: 'Building & Construction',
          subcategory: 'Pipes & Fittings',
          image: '/api/placeholder/300/200',
          description: 'Finolex Pipes, Rigid PVC Pipes, Flexible PVC Pipes',
          vendorCount: 22
        },
        {
          id: '10',
          name: 'Building Brick',
          category: 'Building & Construction',
          subcategory: 'Bricks & Blocks',
          image: '/api/placeholder/300/200',
          description: 'Red Brick, Fly Ash Bricks, Cement Brick',
          vendorCount: 16
        }
      ]
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, [city, mockCategories]);

  const filteredProducts = categories.flatMap(category => 
    category.products.filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleProductClick = (product: Product) => {
    router.push(`/browse-vendors/city/${city}/category/${encodeURIComponent(product.subcategory)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products from {cityName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Products & Services in {cityName}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover quality products and services from verified suppliers in {cityName}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products and services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Building & Construction">Building & Construction</option>
                <option value="Healthcare & Medical">Healthcare & Medical</option>
                <option value="Electronics & Electrical">Electronics & Electrical</option>
                <option value="Textiles & Garments">Textiles & Garments</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Automotive & Transportation">Automotive & Transportation</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found in {cityName}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : 'overflow-hidden'
                }`}
              >
                {/* Product Image */}
                <div className={viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-video'}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={16} />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {product.subcategory}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.vendorCount} vendors
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CityProductsPage;
