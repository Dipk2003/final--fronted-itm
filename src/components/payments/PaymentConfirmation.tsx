'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentService } from '@/services/paymentService';
import { orderAPI, Order } from '@/shared/services/orderApi';
import { Button } from '@/shared/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  DocumentDuplicateIcon,
  ArrowRightIcon,
  TruckIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface PaymentConfirmationProps {
  orderId?: string;
  paymentId?: string;
}

// Use Order interface from orderAPI
type OrderDetails = Order;

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ orderId, paymentId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [error, setError] = useState<string | null>(null);

  // Get parameters from URL if not passed as props
  const actualOrderId = orderId || searchParams?.get('orderId') || '';
  const actualPaymentId = paymentId || searchParams?.get('paymentId') || '';
  const razorpayPaymentId = searchParams?.get('razorpay_payment_id') || '';
  const razorpayOrderId = searchParams?.get('razorpay_order_id') || '';
  const razorpaySignature = searchParams?.get('razorpay_signature') || '';

  const fetchOrderAndPaymentDetails = useCallback(async () => {
    const orderId = parseInt(actualOrderId, 10);
    if (isNaN(orderId)) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      
      // Fetch order details
      // Fetch order details
      const order = await orderAPI.getById(orderId);
      setOrderDetails(order);
      
      // If we have payment verification parameters, verify the payment
      if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
        try {
          const verificationResult = await paymentService.verifyPayment({
            razorpay_payment_id: razorpayPaymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: razorpaySignature
          });
          
          setPaymentStatus(verificationResult.verified ? 'success' : 'failed');
        } catch (verificationError) {
          console.error('Payment verification error:', verificationError);
          setPaymentStatus('failed');
        }
      } else {
        // Determine payment status based on order payment status
        if (order.paymentStatus === 'PAID') {
          setPaymentStatus('success');
        } else if (order.paymentStatus === 'FAILED') {
          setPaymentStatus('failed');
        } else {
          setPaymentStatus('pending');
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [actualOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature]);

  useEffect(() => {
    if (actualOrderId) {
      fetchOrderAndPaymentDetails();
    } else {
      setError('Order ID not found');
      setLoading(false);
    }
  }, [actualOrderId, fetchOrderAndPaymentDetails]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrder = () => {
    router.push(`/orders/${actualOrderId}`);
  };

  const handleTrackOrder = () => {
    router.push(`/orders/track/${orderDetails?.orderNumber}`);
  };

  const handleDownloadInvoice = async () => {
    try {
      const invoiceBlob = await orderAPI.downloadInvoice(parseInt(actualOrderId));
      const url = window.URL.createObjectURL(invoiceBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderDetails?.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleShareOrder = async () => {
    const shareData = {
      title: `Order #${orderDetails?.orderNumber}`,
      text: `I just placed an order on Indian Trade Mart - Order #${orderDetails?.orderNumber}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      // Show toast notification here
    }
  };

  const copyOrderNumber = () => {
    if (orderDetails?.orderNumber) {
      navigator.clipboard.writeText(orderDetails.orderNumber);
      // Show toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="text-center py-12">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <Button 
                onClick={handleContinueShopping} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-16 w-16 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Order Placed Successfully!',
          message: 'Thank you for your order. We\'ll send you a confirmation email shortly.',
          color: 'text-green-900'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or contact support.',
          color: 'text-red-900'
        };
      case 'pending':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. We\'ll update you once it\'s confirmed.',
          color: 'text-yellow-900'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Status Card */}
        <Card className="mb-8">
          <CardContent className="text-center py-12">
            <div className="mx-auto mb-4">
              {getStatusIcon()}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
              {statusInfo.title}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {statusInfo.message}
            </p>
            
            {orderDetails && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 inline-block">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Order Number:</span>
                  <span className="text-lg font-bold text-gray-900">{orderDetails.orderNumber}</span>
                  <button
                    onClick={copyOrderNumber}
                    className="text-blue-500 hover:text-blue-600 p-1"
                    title="Copy order number"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {paymentStatus === 'success' && (
                <>
                  <Button
                    onClick={handleViewOrder}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Order Details
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button
                    onClick={handleTrackOrder}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>

                  <Button
                    onClick={handleDownloadInvoice}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>

                  <Button
                    onClick={handleShareOrder}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}

              {paymentStatus === 'failed' && (
                <Button
                  onClick={() => router.push('/checkout')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Payment Again
                </Button>
              )}

              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        {orderDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold">₹{orderDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Status</label>
                    <p className="text-lg font-semibold capitalize">{orderDetails.status.toLowerCase()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Status</label>
                    <p className="text-lg font-semibold capitalize">{orderDetails.paymentStatus.toLowerCase()}</p>
                  </div>

                  {orderDetails.estimatedDelivery && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estimated Delivery</label>
                      <p className="text-lg font-semibold">
                        {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Your order is being processed
                          </p>
                          <p className="text-sm text-green-600">
                            You'll receive updates via email and SMS
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
