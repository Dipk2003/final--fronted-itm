'use client';

import { clearCartItems } from '@/features/cart/cartSlice';
import { CreatePaymentOrderRequest, paymentService } from '@/services/paymentService';
import { Button } from '@/shared/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Input } from '@/shared/components/Input';
import { orderAPI, CreateOrderDto } from '@/shared/services/orderApi';
import { RootState } from '@/store';
import {
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ShoppingCartIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Address {
  id?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

interface CheckoutFormData {
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  paymentMethod: 'RAZORPAY' | 'COD' | 'BANK_TRANSFER';
  notes?: string;
}

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalAmount, totalItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    billingAddress: {
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    sameAsShipping: true,
    paymentMethod: 'RAZORPAY',
    notes: ''
  });

  // Calculate totals
  const subtotal = totalAmount;
  const taxRate = 0.18; // 18% GST
  const taxAmount = Math.round(subtotal * taxRate);
  const shippingCharges = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const finalAmount = subtotal + taxAmount + shippingCharges;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
    loadSavedAddresses();
  }, [items.length, router]);

  const loadSavedAddresses = async () => {
    try {
      // Load saved addresses from user profile or API
      // This is a mock - replace with actual API call
      setSavedAddresses([
        {
          id: 1,
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          isDefault: true
        }
      ]);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.replace('shippingAddress.', '');
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else if (field.startsWith('billingAddress.')) {
      const addressField = field.replace('billingAddress.', '');
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

    // Auto-copy shipping to billing if same as shipping is checked
    if (field.startsWith('shippingAddress.') && formData.sameAsShipping) {
      const addressField = field.replace('shippingAddress.', '');
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    }
  };

  const handleSameAsShippingChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsShipping: value,
      billingAddress: value ? { ...prev.shippingAddress } : {
        addressLine1: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    }));
  };

  const validateForm = (): boolean => {
    const { shippingAddress, billingAddress, sameAsShipping } = formData;
    
    // Validate shipping address
    if (!shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      setError('Please fill in all shipping address fields');
      return false;
    }

    // Validate billing address if different
    if (!sameAsShipping) {
      if (!billingAddress.addressLine1 || !billingAddress.city || 
          !billingAddress.state || !billingAddress.pincode) {
        setError('Please fill in all billing address fields');
        return false;
      }
    }

    // Validate pincode format
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      setError('Please enter a valid pincode');
      return false;
    }

    if (!sameAsShipping && !pincodeRegex.test(billingAddress.pincode)) {
      setError('Please enter a valid billing pincode');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    setError(null);

    try {
      // Create order
      const orderData: CreateOrderDto = {
        items: items.map(item => ({
          productId: parseInt(item.id, 10), // Convert string ID to number
          quantity: item.quantity,
          price: item.price * 100 // Convert to paise
        })),
        shippingAddressId: 1, // Use a default address ID for now
        billingAddressId: formData.sameAsShipping ? 1 : 2, // Use same address ID or different one
        paymentMethod: formData.paymentMethod === 'RAZORPAY' ? 'ONLINE' : formData.paymentMethod,
        notes: formData.notes
      };

      if (formData.paymentMethod === 'COD') {
        // Handle Cash on Delivery
        const order = await orderAPI.create(orderData);
        setOrderSuccess(true);
        dispatch(clearCartItems());
        
        // Redirect to order confirmation
        setTimeout(() => {
          router.push(`/orders/${order.id}`);
        }, 2000);
        
      } else if (formData.paymentMethod === 'RAZORPAY') {
        // Handle Razorpay payment
        const order = await orderAPI.create(orderData);
        
        // Create payment order
        const paymentOrderRequest: CreatePaymentOrderRequest = {
          orderId: order.id.toString(),
          amount: finalAmount * 100, // Convert to paise
          currency: 'INR',
          customerInfo: {
            name: user?.name || 'Customer',
            email: user?.email || '',
            phone: user?.phone || ''
          } as { name: string; email: string; phone: string; },
          notes: {
            orderId: order.id.toString(),
            customerId: user?.id || ''
          }
        };

        const paymentOrder = await paymentService.createPaymentOrder(paymentOrderRequest);

        // Process payment with Razorpay
        await paymentService.processPayment(
          paymentOrder,
          {
            name: user?.name || 'Customer',
            email: user?.email || '',
            phone: user?.phone || ''
          } as { name: string; email: string; phone: string; },
          async (response) => {
            // Payment successful
            console.log('Payment successful:', response);
            setOrderSuccess(true);
            dispatch(clearCartItems());
            
            // Redirect to order confirmation
            setTimeout(() => {
              router.push(`/orders/${order.id}`);
            }, 2000);
          },
          (error) => {
            // Payment failed
            console.error('Payment failed:', error);
            setError(error.reason || 'Payment failed. Please try again.');
            setProcessing(false);
          }
        );
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. You will receive a confirmation email shortly.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-4">Redirecting to order details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Address Line 1"
                  name="shippingAddress.addressLine1"
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) => handleInputChange('shippingAddress.addressLine1', e.target.value)}
                  placeholder="Street address"
                  required
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="shippingAddress.addressLine2"
                  value={formData.shippingAddress.addressLine2 || ''}
                  onChange={(e) => handleInputChange('shippingAddress.addressLine2', e.target.value)}
                  placeholder="Apartment, suite, etc."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                    placeholder="City"
                    required
                  />
                  <Input
                    label="State"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Pincode"
                    name="shippingAddress.pincode"
                    value={formData.shippingAddress.pincode}
                    onChange={(e) => handleInputChange('shippingAddress.pincode', e.target.value)}
                    placeholder="000000"
                    required
                  />
                  <Input
                    label="Country"
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={(e) => handleInputChange('shippingAddress.country', e.target.value)}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="sameAsShipping" className="text-sm font-medium text-gray-700">
                    Same as shipping address
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <>
                    <Input
                      label="Address Line 1"
                      name="billingAddress.addressLine1"
                      value={formData.billingAddress.addressLine1}
                      onChange={(e) => handleInputChange('billingAddress.addressLine1', e.target.value)}
                      placeholder="Street address"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="City"
                        name="billingAddress.city"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                        placeholder="City"
                        required
                      />
                      <Input
                        label="State"
                        name="billingAddress.state"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                        placeholder="State"
                        required
                      />
                    </div>
                    <Input
                      label="Pincode"
                      name="billingAddress.pincode"
                      value={formData.billingAddress.pincode}
                      onChange={(e) => handleInputChange('billingAddress.pincode', e.target.value)}
                      placeholder="000000"
                      required
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="razorpay"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={formData.paymentMethod === 'RAZORPAY'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="razorpay" className="flex items-center space-x-2">
                      <span>💳</span>
                      <span className="font-medium">Online Payment (Cards, UPI, Net Banking)</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="cod" className="flex items-center space-x-2">
                      <span>💰</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'RAZORPAY' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      You will be redirected to Razorpay secure payment gateway to complete your payment.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'COD' && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-700">
                      Additional ₹50 COD charges will be applied. Pay in cash when your order is delivered.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (18% GST)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <TruckIcon className="h-4 w-4 mr-1" />
                      Shipping
                    </span>
                    <span className={shippingCharges === 0 ? 'text-green-600' : ''}>
                      {shippingCharges === 0 ? 'FREE' : `₹${shippingCharges.toFixed(2)}`}
                    </span>
                  </div>

                  {formData.paymentMethod === 'COD' && (
                    <div className="flex justify-between text-sm">
                      <span>COD Charges</span>
                      <span>₹50.00</span>
                    </div>
                  )}

                  <hr />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(finalAmount + (formData.paymentMethod === 'COD' ? 50 : 0)).toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ₹${(finalAmount + (formData.paymentMethod === 'COD' ? 50 : 0)).toFixed(2)}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
