'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ServiceProvider } from '../types/directory';
import { directoryApi } from '../services/directoryApi';
import { Card } from '@/shared/components';
import { MapPin, Star, Phone, Send } from 'lucide-react';

const LocalSellers: React.FC = () => {
  const [localProviders, setLocalProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLocalProviders();
  }, []);

  const loadLocalProviders = async () => {
    try {
      setIsLoading(true);
      // Get featured providers for the sidebar
      const providers = await directoryApi.getFeaturedProviders(6);
      setLocalProviders(providers);
    } catch (error) {
      console.error('Failed to load local providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Sellers from Patna</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Sellers from Patna</h3>
      
      {localProviders.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No local sellers found
        </p>
      ) : (
        <div className="space-y-4">
          {localProviders.map((provider) => (
            <div key={provider.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                {/* Provider Image */}
                <div className="flex-shrink-0">
                  {provider.images.length > 0 ? (
                    <Image
                      src={provider.images[0]}
                      alt={provider.businessName}
                      width={48}
                      height={48}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {provider.businessName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Provider Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {provider.businessName}
                  </h4>
                  <p className="text-xs text-gray-600 truncate mb-1">
                    {provider.category}
                  </p>
                  
                  {/* Location */}
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{provider.location.city}</span>
                  </div>

                  {/* Rating */}
                  {provider.rating.average > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                        <Star size={10} className="mr-1 fill-current" />
                        <span>{provider.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors">
                      <Phone size={10} className="mr-1" />
                      Contact
                    </button>
                    <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                      <Send size={10} className="mr-1" />
                      Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View More Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all local sellers in Patna →
            </button>
          </div>
        </div>
      )}

      {/* Quote Request Form */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Tell us what you need, and we'll help you get quotes
        </h4>
        
        <form className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="I want quotes for:"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              By submitting, you agree to our terms and conditions.
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white text-sm font-medium py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Submit Requirement
          </button>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
              ?
            </span>
            Have a Question? Ask our expert
          </h4>
          <p className="text-xs text-blue-800 mb-3">
            Service required to:
          </p>
          <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors">
            Ask Now
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-2">We are here to help you!</p>
        <div className="text-xs text-gray-400">
          Follow us: 
          <span className="text-blue-600 ml-1">🌍 📘 📸 💼 🔗</span>
        </div>
      </div>
    </Card>
  );
};

export default LocalSellers;
