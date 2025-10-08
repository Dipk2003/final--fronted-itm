'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar, Footer } from '@/shared/components';
import { Search, Filter, MapPin, Star, Building, Users, Package, Phone, Mail, Globe, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { vendorAPI, type Vendor } from '@/shared/services';

const CategoryVendorsPage: React.FC = () => {
  const params = useParams();
  const city = params?.city as string;
  const category = params?.category as string;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const cityName = city ? decodeURIComponent(city).charAt(0).toUpperCase() + decodeURIComponent(city).slice(1).toLowerCase() : '';
  const categoryName = category ? decodeURIComponent(category) : '';

  useEffect(() => {
    if (city) {
      const fetchVendors = async () => {
        try {
          setLoading(true);
          const data = filter === 'verified' 
            ? await vendorAPI.getVerifiedVendorsByCity(city)
            : await vendorAPI.getVendorsByCity(city);
          
          // Filter vendors based on category if needed
          // This is a simple filter - you might want to implement proper category matching in backend
          const filteredData = data.filter(vendor => 
            vendor.businessName?.toLowerCase().includes(categoryName.toLowerCase()) ||
            vendor.name?.toLowerCase().includes(categoryName.toLowerCase())
          );
          
          setVendors(filteredData.length > 0 ? filteredData : data);
        } catch (err) {
          setError('Error fetching vendors. Please try again later.');
          console.error('Error fetching vendors:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchVendors();
    }
  }, [city, category, filter, categoryName]);

  const handleFilterChange = (newFilter: 'all' | 'verified') => {
    setFilter(newFilter);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {categoryName} vendors from {cityName}...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link href={`/city/${city}`} className="hover:text-indigo-600">{cityName}</Link>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href={`/city/${city}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to {cityName} Products
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName} Vendors in {cityName}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find verified {categoryName.toLowerCase()} suppliers and service providers in {cityName}
          </p>
        </div>

        {/* Search and Filter Options */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Vendors
                </button>
                <button
                  onClick={() => handleFilterChange('verified')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    filter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="mr-1" size={16} />
                  Verified Only
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Vendors List */}
        {filteredVendors.length > 0 ? (
          <div className="space-y-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vendor Icon */}
                  <div className="lg:w-1/6 flex justify-center lg:justify-start">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className="lg:w-5/6">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">
                            {vendor.businessName || vendor.name}
                          </h3>
                          {vendor.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="mr-2" size={14} />
                            <span>{vendor.businessAddress || `${vendor.city}, ${vendor.state}`}</span>
                          </div>
                          {vendor.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-2" size={14} />
                              <span>{vendor.phone}</span>
                            </div>
                          )}
                          {vendor.email && (
                            <div className="flex items-center">
                              <Mail className="mr-2" size={14} />
                              <span>{vendor.email}</span>
                            </div>
                          )}
                          {vendor.gstNumber && (
                            <div className="flex items-center">
                              <Package className="mr-2" size={14} />
                              <span>GST: {vendor.gstNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {categoryName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center text-sm">
                        <Mail className="mr-2" size={16} />
                        Send Inquiry
                      </button>
                      {vendor.phone && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm">
                          <Phone className="mr-2" size={16} />
                          Call Now
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm">
                        <Building className="mr-2" size={16} />
                        View Profile
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm">
                        <Package className="mr-2" size={16} />
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <Building size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any {filter === 'verified' ? 'verified ' : ''}{categoryName.toLowerCase()} vendors in {cityName} at the moment.
              </p>
              <Link 
                href={`/city/${city}`}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Search className="mr-2" size={16} />
                Browse All Products
              </Link>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryVendorsPage;
