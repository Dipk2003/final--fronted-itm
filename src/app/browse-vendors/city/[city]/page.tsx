'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar, Footer } from '@/shared/components';
import { Search, Filter, MapPin, Star, Building, Users, Package, Phone, Mail, Globe, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { vendorAPI, type Vendor } from '@/shared/services';

const CityVendorsPage: React.FC = () => {
  const params = useParams();
  const city = params?.city as string;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified'>('all');

  const cityName = city ? decodeURIComponent(city).charAt(0).toUpperCase() + decodeURIComponent(city).slice(1).toLowerCase() : '';

  useEffect(() => {
    if (city) {
      const fetchVendors = async () => {
        try {
          setLoading(true);
          const data = filter === 'verified' 
            ? await vendorAPI.getVerifiedVendorsByCity(city)
            : await vendorAPI.getVendorsByCity(city);
          setVendors(data);
        } catch (err) {
          setError('Error fetching vendors. Please try again later.');
          console.error('Error fetching vendors:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchVendors();
    }
  }, [city, filter]);

  const handleFilterChange = (newFilter: 'all' | 'verified') => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendors from {cityName}...</p>
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
            Vendors in {cityName}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover verified suppliers and service providers in {cityName}
          </p>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
            <div className="text-sm text-gray-600">
              {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Vendors List */}
        {vendors.length > 0 ? (
          <div className="space-y-6">
            {vendors.map((vendor) => (
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
                We couldn't find any {filter === 'verified' ? 'verified ' : ''}vendors in {cityName} at the moment.
              </p>
              <Link 
                href="/search-suppliers" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Search className="mr-2" size={16} />
                Search All Suppliers
              </Link>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CityVendorsPage;

