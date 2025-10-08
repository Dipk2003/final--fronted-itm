'use client';

import React, { useState } from 'react';
import { ServiceProvider } from '../types/directory';
import { Card } from '@/shared/components';
import { 
  Phone, 
  MapPin, 
  Star, 
  Shield, 
  CheckCircle, 
  Clock, 
  Send,
  Eye,
  MessageCircle
} from 'lucide-react';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onContactSupplier: (providerId: string) => void;
  onViewMobileNumber: (providerId: string) => void;
  showContactForm?: boolean;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onContactSupplier,
  onViewMobileNumber,
  showContactForm = false
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatResponseRate = (rate: number) => {
    return `${Math.round(rate)}% Response Rate`;
  };

  const getVerificationBadges = () => {
    const badges: React.ReactElement[] = [];
    
    if (provider.verification.isGSTVerified) {
      badges.push(
        <div key="gst" className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          <CheckCircle size={12} className="mr-1" />
          GST
        </div>
      );
    }
    
    if (provider.verification.isTrustSEALVerified) {
      badges.push(
        <div key="trustseal" className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <Shield size={12} className="mr-1" />
          TrustSEAL Verified
        </div>
      );
    }
    
    if (provider.verification.isVerifiedSupplier) {
      badges.push(
        <div key="verified" className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
          <CheckCircle size={12} className="mr-1" />
          Verified Plus Supplier
        </div>
      );
    }

    return badges;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {provider.isPremium && (
        <div className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded mb-3 inline-block">
          STAR SUPPLIER
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {provider.businessName || provider.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {provider.name !== provider.businessName && provider.name}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin size={14} className="mr-1" />
            {provider.location.city}, {provider.location.state}
          </div>

          {/* Rating and Years in Business */}
          <div className="flex items-center space-x-4 mb-3">
            {provider.rating.average > 0 && (
              <div className="flex items-center">
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  <Star size={12} className="mr-1 fill-current" />
                  {provider.rating.average.toFixed(1)} ({provider.rating.count})
                </div>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1" />
              {provider.verification.yearsInBusiness} yrs
            </div>
            
            <div className="text-sm text-blue-600 font-medium">
              {formatResponseRate(provider.responseRate)}
            </div>
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {getVerificationBadges()}
          </div>
        </div>

        {provider.images.length > 0 && (
          <div className="ml-4">
            <img
              src={provider.images[0]}
              alt={provider.businessName}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {showFullDescription 
            ? provider.description
            : `${provider.description.substring(0, 150)}${provider.description.length > 150 ? '...' : ''}`
          }
        </p>
        {provider.description.length > 150 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-600 text-sm hover:text-blue-800 mt-1"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Services */}
      {provider.services.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {provider.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="text-xs text-gray-500">
                +{provider.services.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewMobileNumber(provider.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors text-sm font-medium"
        >
          <Phone size={16} className="mr-2" />
          View Mobile Number
        </button>
        
        <button
          onClick={() => onContactSupplier(provider.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          <Send size={16} className="mr-2" />
          Contact Supplier
        </button>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <div className="flex items-center">
          <Eye size={12} className="mr-1" />
          {provider.isPremium ? 'Premium Listing' : 'Free Listing'}
        </div>
        <div>
          Est. {provider.establishmentYear || 'N/A'}
        </div>
      </div>
    </Card>
  );
};

export default ServiceProviderCard;
