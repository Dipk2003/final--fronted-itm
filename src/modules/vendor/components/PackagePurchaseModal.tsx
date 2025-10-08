'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Loader,
  Crown,
  Star,
  Zap,
  Sparkles,
  Shield,
  Info
} from 'lucide-react';
import { 
  VendorPackagePlan, 
  VendorPackagePurchase,
  vendorPackageAPI, 
  packageHelpers 
} from '../services/vendorPackageApi';

interface PackagePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: VendorPackagePlan | null;
  onSuccess?: (transactionId: string) => void;
}

interface FormData {
  billingPeriod: 'monthly' | 'yearly';
  paymentMethod: 'card' | 'upi' | 'netbanking';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  email: string;
  phone: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  agreeToTerms: boolean;
}

const PackagePurchaseModal: React.FC<PackagePurchaseModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    billingPeriod: 'monthly',
    paymentMethod: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    agreeToTerms: false
  });

  const getPlanIcon = (planType: string) => {
    const icons = {
      SILVER: Crown,
      GOLD: Star,
      PLATINUM: Zap,
      DIAMOND: Sparkles
    };
    return icons[planType as keyof typeof icons] || Crown;
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const basePrice = formData.billingPeriod === 'yearly' && selectedPackage.yearlyPrice 
      ? selectedPackage.yearlyPrice 
      : (selectedPackage.discountedPrice || selectedPackage.price);
    
    const tax = basePrice * 0.18; // 18% GST
    return basePrice + tax;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.billingPeriod === 'monthly' || formData.billingPeriod === 'yearly';
      case 2:
        if (formData.paymentMethod === 'card') {
          return formData.cardNumber.length >= 16 && 
                 formData.expiryMonth !== '' && 
                 formData.expiryYear !== '' && 
                 formData.cvv.length >= 3 && 
                 formData.cardholderName.trim() !== '';
        }
        return true;
      case 3:
        return formData.email.includes('@') && 
               formData.phone.length >= 10 &&
               formData.billingAddress.street !== '' &&
               formData.billingAddress.city !== '' &&
               formData.billingAddress.state !== '' &&
               formData.billingAddress.zipCode !== '';
      case 4:
        return formData.agreeToTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedPackage || !validateStep(4)) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const purchaseRequest: VendorPackagePurchase = {
        planId: selectedPackage.id,
        paymentMethod: formData.paymentMethod === 'card' ? 'CREDIT_CARD' : 
                      formData.paymentMethod === 'upi' ? 'UPI' : 'NET_BANKING',
        billingAddress: `${formData.billingAddress.street}, ${formData.billingAddress.city}`,
        billingCity: formData.billingAddress.city,
        billingState: formData.billingAddress.state,
        billingPincode: formData.billingAddress.zipCode,
        generateInvoice: true,
        notes: `Billing period: ${formData.billingPeriod}`
      };

      const response = await vendorPackageAPI.purchasePackage(purchaseRequest);
      
      onSuccess?.(response.data?.transactionId || 'unknown');
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setError(null);
    setFormData({
      billingPeriod: 'monthly',
      paymentMethod: 'card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      email: '',
      phone: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      agreeToTerms: false
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !selectedPackage) return null;

  const IconComponent = getPlanIcon(selectedPackage.planType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upgrade to {selectedPackage.displayName}</h2>
                  <p className="text-blue-100">Complete your subscription purchase</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-6 flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-400 text-white'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-white' : 'bg-blue-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Left Column - Form */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
              {/* Step 1: Plan Selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Choose Billing Period</h3>
                  
                  <div className="space-y-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.billingPeriod === 'monthly' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('billingPeriod', 'monthly')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Monthly Plan</p>
                          <p className="text-gray-600 text-sm">Pay monthly, cancel anytime</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {packageHelpers.formatPrice(selectedPackage.discountedPrice || selectedPackage.price)}
                          </p>
                          <p className="text-gray-600 text-sm">/month</p>
                        </div>
                      </div>
                    </div>

                    {selectedPackage.yearlyPrice && (
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                          formData.billingPeriod === 'yearly' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('billingPeriod', 'yearly')}
                      >
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Save 20%
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Yearly Plan</p>
                            <p className="text-gray-600 text-sm">2 months free with yearly billing</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {packageHelpers.formatPrice(selectedPackage.yearlyPrice)}
                            </p>
                            <p className="text-gray-600 text-sm">/year</p>
                            <p className="text-green-600 text-xs font-medium">
                              (Save {packageHelpers.formatPrice(selectedPackage.price * 12 - selectedPackage.yearlyPrice)})
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI', icon: Phone },
                      { id: 'netbanking', label: 'Net Banking', icon: Shield }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleInputChange('paymentMethod', id)}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                          formData.paymentMethod === id
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Month
                          </label>
                          <select
                            value={formData.expiryMonth}
                            onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <select
                            value={formData.expiryYear}
                            onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">YY</option>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year.toString().slice(-2)}>
                                {year.toString().slice(-2)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <p className="text-blue-800 font-medium">UPI Payment</p>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'netbanking' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-green-600" />
                        <p className="text-green-800 font-medium">Net Banking</p>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        You will be redirected to your bank's website to complete the payment
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Billing Information */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Billing Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.street}
                      onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                      placeholder="123 Main Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                        placeholder="Mumbai"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress.zipCode}
                        onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                        placeholder="400001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={formData.billingAddress.country}
                        onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Confirm */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Review & Confirm</h3>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Plan:</span>
                      <span className="font-medium">{selectedPackage.displayName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Billing:</span>
                      <span className="font-medium capitalize">{formData.billingPeriod}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Payment Method:</span>
                      <span className="font-medium capitalize">{formData.paymentMethod}</span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">
                        {packageHelpers.formatPrice(
                          formData.billingPeriod === 'yearly' && selectedPackage.yearlyPrice 
                            ? selectedPackage.yearlyPrice 
                            : (selectedPackage.discountedPrice || selectedPackage.price)
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">GST (18%):</span>
                      <span className="font-medium">
                        {packageHelpers.formatPrice(calculateTotal() - (formData.billingPeriod === 'yearly' && selectedPackage.yearlyPrice 
                          ? selectedPackage.yearlyPrice 
                          : (selectedPackage.discountedPrice || selectedPackage.price)))}
                      </span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{packageHelpers.formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked.toString())}
                        className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.agreeToTerms}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && <Loader className="h-4 w-4 animate-spin" />}
                    <span>Complete Purchase</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Package Summary */}
            <div className="w-80 bg-gray-50 p-6 border-l">
              <div className="sticky top-0">
                <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${
                      selectedPackage.planType === 'SILVER' ? 'from-gray-400 to-gray-600' :
                      selectedPackage.planType === 'GOLD' ? 'from-yellow-400 to-yellow-600' :
                      selectedPackage.planType === 'PLATINUM' ? 'from-purple-400 to-purple-600' :
                      'from-blue-400 to-blue-600'
                    }`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedPackage.displayName}</p>
                      <p className="text-gray-600 text-sm">{selectedPackage.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {packageHelpers.getDisplayFeatures(selectedPackage).slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {packageHelpers.getDisplayFeatures(selectedPackage).length > 5 && (
                      <p className="text-blue-600 text-xs">
                        +{packageHelpers.getDisplayFeatures(selectedPackage).length - 5} more features
                      </p>
                    )}
                  </div>
                </div>

                {selectedPackage.trialDays && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 text-sm font-medium">
                      🎉 {selectedPackage.trialDays} Days Free Trial
                    </p>
                    <p className="text-blue-700 text-xs">
                      You won't be charged until your trial ends
                    </p>
                  </div>
                )}

                <div className="text-center text-xs text-gray-500 mt-6">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Shield className="h-3 w-3" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <p>Cancel anytime • No hidden fees</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PackagePurchaseModal;
