'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Plan {
  id: number;
  planCode: string;
  planName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  discountPercentage?: number;
  maxProducts: number | null;
  maxLeadsPerMonth: number | null;
  featuredListings: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  bulkOperations: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

interface Subscription {
  id: number;
  sellerPlan: Plan;
  subscriptionDate: string;
  isActive: boolean;
  nextBillingDate: string;
  monthlyPrice: number;
  usageStats: {
    productsListed: number;
    leadsGenerated: number;
    analyticsAccessed: number;
    supportTicketsRaised: number;
  };
}

export default function PlanPurchaseFlow() {
  const [step, setStep] = useState(1); // 1: Select Plan, 2: Billing Cycle, 3: Payment, 4: Confirmation
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load plans and current subscription
  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vendor/plans', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/vendor/plans/my-subscription', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success && data.data.hasSubscription) {
        setCurrentSubscription(data.data.subscription);
      }
    } catch (error) {
      console.error('Error loading current subscription:', error);
    }
  };

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleSubscription = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/vendor/plans/${selectedPlan.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: 'CREDIT_CARD', // This would come from payment form
          billingCycle: billingCycle
        })
      });
      const data = await response.json();
      if (data.success) {
        setStep(4);
        loadCurrentSubscription(); // Refresh subscription data
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (plan: Plan, cycle: 'MONTHLY' | 'YEARLY') => {
    return cycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const calculateSavings = (plan: Plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <div className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      plan.isPopular ? 'border-blue-500' : 'border-gray-200'
    }`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      )}
      {plan.isRecommended && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            RECOMMENDED
          </span>
        </div>
      )}
      
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">{plan.planName}</h3>
          <p className="text-gray-600 mt-2">{plan.description}</p>
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                ₹{billingCycle === 'YEARLY' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
              </span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            {billingCycle === 'YEARLY' && (
              <div className="mt-2">
                <span className="text-sm text-green-600">
                  Save ₹{calculateSavings(plan)} annually!
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">
              {plan.maxProducts === null ? 'Unlimited' : plan.maxProducts} Products
            </span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">
              {plan.maxLeadsPerMonth === null ? 'Unlimited' : plan.maxLeadsPerMonth} Leads/Month
            </span>
          </div>
          {plan.advancedAnalytics && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">Advanced Analytics</span>
            </div>
          )}
          {plan.bulkOperations && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">Bulk Upload</span>
            </div>
          )}
          {plan.prioritySupport && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">Priority Support</span>
            </div>
          )}
        </div>

        <button
          onClick={() => handlePlanSelection(plan)}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            plan.isPopular 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Choose Plan
        </button>
      </div>
    </div>
  );

  const BillingCycleStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Choose Billing Cycle</h2>
        <p className="text-gray-600 mt-2">Save more with annual billing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900">{selectedPlan?.planName}</h3>
            <p className="text-gray-600">{selectedPlan?.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              billingCycle === 'MONTHLY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setBillingCycle('MONTHLY')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={billingCycle === 'MONTHLY'}
                  onChange={() => setBillingCycle('MONTHLY')}
                  className="mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Monthly Billing</h4>
                  <p className="text-sm text-gray-600">Pay monthly, cancel anytime</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">₹{selectedPlan?.monthlyPrice}</div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
          </div>

          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
              billingCycle === 'YEARLY' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => setBillingCycle('YEARLY')}
          >
            <div className="absolute -top-2 right-4">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                SAVE {selectedPlan && Math.round(((calculateSavings(selectedPlan) / (selectedPlan.monthlyPrice * 12)) * 100))}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={billingCycle === 'YEARLY'}
                  onChange={() => setBillingCycle('YEARLY')}
                  className="mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Annual Billing</h4>
                  <p className="text-sm text-gray-600">
                    Save ₹{selectedPlan && calculateSavings(selectedPlan)} per year
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">₹{selectedPlan?.yearlyPrice}</div>
                <div className="text-sm text-gray-500">/year</div>
                <div className="text-xs text-green-600">
                  (₹{selectedPlan && Math.round(selectedPlan.yearlyPrice / 12)}/month)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setStep(1)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back to Plans
          </button>
          <button
            onClick={() => setStep(3)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Payment Details</h2>
        <p className="text-gray-600 mt-2">Complete your subscription</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Order Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{selectedPlan?.planName} - {billingCycle.toLowerCase()}</span>
              <span className="font-semibold">₹{selectedPlan && calculatePrice(selectedPlan, billingCycle)}</span>
            </div>
            {billingCycle === 'YEARLY' && selectedPlan && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>Annual savings</span>
                <span>-₹{calculateSavings(selectedPlan)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{selectedPlan && calculatePrice(selectedPlan, billingCycle)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStep(2)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleSubscription}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Subscribe - ₹${selectedPlan && calculatePrice(selectedPlan, billingCycle)}`}
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Subscription Confirmed!</h2>
        <p className="text-gray-600 mt-2">Welcome to {selectedPlan?.planName}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600 mb-6">
          Your subscription is now active. You can start using all the features immediately.
        </p>
        
        <div className="space-y-3 text-left mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Plan</span>
            <span className="font-semibold">{selectedPlan?.planName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Billing Cycle</span>
            <span className="font-semibold">{billingCycle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold">₹{selectedPlan && calculatePrice(selectedPlan, billingCycle)}</span>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  // Current Subscription Display
  if (currentSubscription && step === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Current Plan</h1>
          <p className="text-gray-600 mt-2">Manage your subscription</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl font-bold">
                  {currentSubscription.sellerPlan.planName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentSubscription.sellerPlan.planName}</h3>
                <p className="text-gray-600">Active since {new Date(currentSubscription.subscriptionDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">₹{currentSubscription.monthlyPrice}/month</div>
              <div className="text-sm text-gray-500">Next billing: {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {currentSubscription.usageStats.productsListed}
              </div>
              <div className="text-sm text-gray-600">Products Listed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentSubscription.usageStats.leadsGenerated}
              </div>
              <div className="text-sm text-gray-600">Leads Generated</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {currentSubscription.usageStats.analyticsAccessed}
              </div>
              <div className="text-sm text-gray-600">Analytics Views</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {currentSubscription.usageStats.supportTicketsRaised}
              </div>
              <div className="text-sm text-gray-600">Support Tickets</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentSubscription(null)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upgrade Plan
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2 max-w-md mx-auto">
            <span>Choose Plan</span>
            <span>Billing</span>
            <span>Payment</span>
            <span>Confirm</span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
              <p className="text-gray-600 mt-2">Select the perfect plan for your business</p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center mt-6">
                <span className={`mr-3 ${billingCycle === 'MONTHLY' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    billingCycle === 'YEARLY' ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    billingCycle === 'YEARLY' ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className={`ml-3 ${billingCycle === 'YEARLY' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Yearly <span className="text-green-600 text-sm">(Save up to 25%)</span>
                </span>
              </div>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-8`}>
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Compare all features
              </button>
            </div>
          </div>
        )}

        {step === 2 && <BillingCycleStep />}
        {step === 3 && <PaymentStep />}
        {step === 4 && <ConfirmationStep />}
      </div>
    </div>
  );
}