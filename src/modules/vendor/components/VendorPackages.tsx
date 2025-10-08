'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Crown, 
  Zap, 
  Star, 
  CheckCircle, 
  XCircle, 
  Shield,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  Settings,
  Clock,
  Gift,
  Sparkles
} from 'lucide-react';
import { 
  VendorPackagePlan, 
  CurrentSubscription,
  vendorPackageAPI, 
  packageHelpers 
} from '../services/vendorPackageApi';

interface VendorPackagesProps {
  onPurchase?: (packageId: number) => void;
}

const VendorPackages: React.FC<VendorPackagesProps> = ({ onPurchase }) => {
  const [packages, setPackages] = useState<VendorPackagePlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<VendorPackagePlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPackagesData();
  }, []);

  const fetchPackagesData = async () => {
    try {
      setLoading(true);
      const [packagesData, subscriptionData] = await Promise.all([
        vendorPackageAPI.getAllPackages(),
        vendorPackageAPI.getCurrentSubscription().catch(() => null)
      ]);
      
      setPackages(packagesData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: VendorPackagePlan) => {
    setSelectedPlan(pkg);
    onPurchase?.(pkg.id);
  };

  const getPlanIcon = (planType: string) => {
    const icons = {
      SILVER: Crown,
      GOLD: Star,
      PLATINUM: Zap,
      DIAMOND: Sparkles
    };
    return icons[planType as keyof typeof icons] || Package;
  };

  const getPlanGradient = (planType: string) => {
    const gradients = {
      SILVER: 'from-gray-400 to-gray-600',
      GOLD: 'from-yellow-400 to-yellow-600',
      PLATINUM: 'from-purple-400 to-purple-600',
      DIAMOND: 'from-blue-400 to-blue-600'
    };
    return gradients[planType as keyof typeof gradients] || 'from-gray-400 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Choose Your <span className="text-blue-600">Growth Plan</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Unlock powerful features to scale your business on India's largest B2B marketplace
        </motion.p>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && currentSubscription.isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Active Subscription ({currentSubscription.daysRemaining} days remaining)
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {packages.map((pkg, index) => {
          const IconComponent = getPlanIcon(pkg.planType);
          const isCurrentPlan = pkg.isCurrentPlan;
          const displayPrice = billingPeriod === 'yearly' && pkg.yearlyPrice 
            ? pkg.yearlyPrice 
            : (pkg.discountedPrice || pkg.price);
          const originalPrice = billingPeriod === 'yearly' && pkg.yearlyPrice 
            ? pkg.price * 12 
            : pkg.price;
          
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 p-6 hover:shadow-2xl transition-all duration-300 ${
                pkg.isPopular 
                  ? 'border-blue-500 shadow-xl transform scale-105' 
                  : isCurrentPlan
                  ? 'border-green-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${
                  pkg.isPopular ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {pkg.badge}
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  Current Plan
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanGradient(pkg.planType)} mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.displayName}</h3>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {packageHelpers.formatPrice(displayPrice)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingPeriod === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                {pkg.discountedPrice && pkg.discountedPrice < originalPrice && (
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <span className="text-gray-400 line-through text-sm">
                      {packageHelpers.formatPrice(originalPrice)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Save {packageHelpers.calculateSavingsPercentage(originalPrice, pkg.discountedPrice)}%
                    </span>
                  </div>
                )}

                {pkg.trialDays && (
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {pkg.trialDays} Days Free Trial
                    </span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="space-y-3 mb-6">
                {packageHelpers.getDisplayFeatures(pkg).slice(0, 6).map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {packageHelpers.getDisplayFeatures(pkg).length > 6 && (
                  <div className="text-center">
                    <button className="text-blue-600 text-sm hover:underline">
                      +{packageHelpers.getDisplayFeatures(pkg).length - 6} more features
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                    : pkg.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : 'Get Started'}
              </button>

              {/* Offer Text */}
              {pkg.offerText && (
                <div className="mt-3 text-center">
                  <span className="text-xs text-orange-600 font-medium">
                    🎁 {pkg.offerText}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          <BarChart3 className="h-5 w-5" />
          <span>{showComparison ? 'Hide' : 'Compare'} All Features</span>
        </button>
      </div>

      {/* Feature Comparison Table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Detailed Feature Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Features</th>
                      {packages.map(pkg => (
                        <th key={pkg.id} className="text-center py-3 px-4 font-semibold text-gray-700">
                          {pkg.displayName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Core Features */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900">Max Products</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.maxProducts ? pkg.maxProducts.toLocaleString() : 'Unlimited'}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Max Leads</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.maxLeads ? pkg.maxLeads.toLocaleString() : 'Unlimited'}
                        </td>
                      ))}
                    </tr>

                    {/* Premium Features */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900">Featured Listing</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.featuredListing ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Priority Support</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.prioritySupport ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900">Analytics Access</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.analyticsAccess ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Custom Branding</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.customBranding ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900">API Access</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.apiAccess ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Storage Limit</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} className="py-3 px-4 text-center">
                          {pkg.storageLimit ? `${pkg.storageLimit}GB` : 'Unlimited'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Trusted by 50,000+ Vendors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-semibold text-gray-900">Secure Payments</p>
              <p className="text-gray-600 text-sm">256-bit SSL encryption</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-semibold text-gray-900">24/7 Support</p>
              <p className="text-gray-600 text-sm">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-semibold text-gray-900">Growth Guaranteed</p>
              <p className="text-gray-600 text-sm">Or money back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPackages;
