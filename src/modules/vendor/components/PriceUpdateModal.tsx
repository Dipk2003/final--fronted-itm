'use client';

import React, { useState } from 'react';
import { productAPI } from '@/shared/services/productApi';

interface PriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onProductsUpdated: () => void;
}

export default function PriceUpdateModal({
  isOpen,
  onClose,
  products,
  onProductsUpdated
}: PriceUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [updatedProducts, setUpdatedProducts] = useState<{[key: string]: number}>({});
  const [currentStep, setCurrentStep] = useState<'form' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle price change for a specific product
  const handlePriceChange = (productId: string, price: string) => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      setUpdatedProducts({
        ...updatedProducts,
        [productId]: numericPrice
      });
    }
  };

  // Submit all price updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Updating prices for products:', Object.keys(updatedProducts).length);
      
      let successfulUpdates = 0;
      
      // Process each price update
      for (const productId in updatedProducts) {
        try {
          // Calling update API for each product
          await productAPI.updateProductPrice(productId, updatedProducts[productId]);
          successfulUpdates++;
          console.log(`✅ Updated price for product ${productId} to ${updatedProducts[productId]}`);
        } catch (productError) {
          console.error(`❌ Failed to update price for product ${productId}:`, productError);
        }
      }
      
      setSuccessCount(successfulUpdates);
      
      if (successfulUpdates > 0) {
        setCurrentStep('success');
        // Notify parent component about successful updates
        if (successfulUpdates === Object.keys(updatedProducts).length) {
          // All updates were successful
          console.log('🎉 All price updates completed successfully');
        } else {
          console.log(`⚠️ ${successfulUpdates} out of ${Object.keys(updatedProducts).length} price updates completed`);
        }
      } else {
        throw new Error('No products were updated successfully');
      }
    } catch (error: any) {
      console.error('❌ Error updating product prices:', error);
      setError(error.message || 'Failed to update product prices');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // If we had successful updates, notify the parent component
    if (currentStep === 'success' && successCount > 0) {
      onProductsUpdated();
    }
    onClose();
    
    // Reset state for next time the modal opens
    setUpdatedProducts({});
    setCurrentStep('form');
    setError(null);
    setSuccessCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">💰</span>
              {currentStep === 'form' && 'Update Product Prices'}
              {currentStep === 'success' && 'Prices Updated Successfully'}
              {currentStep === 'error' && 'Error Updating Prices'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          {currentStep === 'form' && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-yellow-500 text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Need Pricing</h3>
                  <p className="text-gray-600">
                    All your products already have prices set. You can edit prices from the product list view.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-gray-600 mb-4">
                    Set prices for your products to increase visibility and sales potential.
                  </p>
                  
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
                    {products.map(product => (
                      <div 
                        key={product.id} 
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              {product.category?.name || 'No Category'} • SKU: {product.sku || 'N/A'}
                            </p>
                          </div>
                          <div className="w-full sm:w-36">
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue={product.price || ''}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">USD</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || Object.keys(updatedProducts).length === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading || Object.keys(updatedProducts).length === 0
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {loading ? 'Updating...' : 'Update Prices'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
          
          {currentStep === 'success' && (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Prices Updated Successfully</h3>
              <p className="text-gray-600 mb-6">
                {successCount} {successCount === 1 ? 'product' : 'products'} had their price{successCount === 1 ? '' : 's'} updated.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
          
          {currentStep === 'error' && (
            <div className="text-center py-8">
              <div className="text-red-500 text-5xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Updating Prices</h3>
              <p className="text-gray-600 mb-6">
                {error || 'An unexpected error occurred while updating prices.'}
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
