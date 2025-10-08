'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import VendorPackages from './VendorPackages';
import PackagePurchaseModal from './PackagePurchaseModal';
import { VendorPackagePlan, vendorPackageAPI } from '../services/vendorPackageApi';

const VendorPackagesPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<VendorPackagePlan | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');

  const handlePackageSelect = async (packageId: number) => {
    try {
      // Fetch the full package details
      const packages = await vendorPackageAPI.getAllPackages();
      const selectedPkg = packages.find(pkg => pkg.id === packageId);
      
      if (selectedPkg) {
        setSelectedPackage(selectedPkg);
        setShowPurchaseModal(true);
      }
    } catch (error) {
      console.error('Error selecting package:', error);
    }
  };

  const handlePurchaseSuccess = (transactionId: string) => {
    setTransactionId(transactionId);
    setShowPurchaseModal(false);
    setShowSuccessMessage(true);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setTransactionId('');
    }, 5000);
  };

  const handlePurchaseModalClose = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Payment Successful!</p>
            <p className="text-green-100 text-sm">Transaction ID: {transactionId}</p>
          </div>
        </motion.div>
      )}

      {/* Main Packages Component */}
      <VendorPackages onPurchase={handlePackageSelect} />

      {/* Purchase Modal */}
      <PackagePurchaseModal
        isOpen={showPurchaseModal}
        onClose={handlePurchaseModalClose}
        selectedPackage={selectedPackage}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default VendorPackagesPage;
