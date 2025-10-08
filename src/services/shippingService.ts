import { api } from '@/shared/services/api';

// Shipping Provider Types
export type ShippingProvider = 'DELHIVERY' | 'BLUE_DART' | 'DTDC' | 'FEDEX' | 'EKART' | 'INDIA_POST';

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

export interface ShippingPackage {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
  weight: number; // kg
  value: number;  // INR
  description: string;
  fragile?: boolean;
}

export interface ShippingRate {
  provider: ShippingProvider;
  serviceName: string;
  cost: number;
  estimatedDeliveryDays: number;
  estimatedDeliveryDate: string;
  features: string[];
  available: boolean;
  errorMessage?: string;
}

export interface ShippingLabel {
  id: string;
  trackingNumber: string;
  provider: ShippingProvider;
  labelUrl: string;
  manifestUrl?: string;
  estimatedDelivery: string;
  cost: number;
  status: 'created' | 'printed' | 'shipped' | 'cancelled';
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
  eventCode?: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  provider: ShippingProvider;
  currentStatus: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  origin: string;
  destination: string;
  events: TrackingEvent[];
  lastUpdated: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  pincodes: string[];
  states: string[];
  deliveryDays: number;
  cod_available: boolean;
  restrictions?: string[];
}

export interface ShippingRule {
  id: string;
  name: string;
  conditions: {
    minWeight?: number;
    maxWeight?: number;
    minValue?: number;
    maxValue?: number;
    pincodes?: string[];
    states?: string[];
    categories?: string[];
  };
  actions: {
    provider?: ShippingProvider;
    freeShipping?: boolean;
    shippingDiscount?: number;
    priorityShipping?: boolean;
  };
  active: boolean;
}

export interface BulkShippingRequest {
  orders: Array<{
    orderId: string;
    fromAddress: ShippingAddress;
    toAddress: ShippingAddress;
    packageDetails: ShippingPackage;
    provider?: ShippingProvider;
  }>;
  preferences: {
    autoSelectCheapest?: boolean;
    autoSelectFastest?: boolean;
    preferredProviders?: ShippingProvider[];
    cod?: boolean;
  };
}

export interface ShippingAnalytics {
  totalShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  avgDeliveryTime: number;
  totalShippingCost: number;
  providerPerformance: Array<{
    provider: ShippingProvider;
    totalShipments: number;
    onTimeDeliveryRate: number;
    avgDeliveryTime: number;
    avgCost: number;
    customerRating: number;
  }>;
  zonePerformance: Array<{
    zone: string;
    totalShipments: number;
    avgDeliveryTime: number;
    deliverySuccessRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    shipments: number;
    cost: number;
    avgDeliveryTime: number;
  }>;
}

class ShippingService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = '/api/shipping';
  }

  // Get shipping rates from multiple providers
  async getShippingRates(
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packageDetails: ShippingPackage,
    options?: {
      providers?: ShippingProvider[];
      cod?: boolean;
      express?: boolean;
    }
  ): Promise<ShippingRate[]> {
    try {
      const response = await api.post(`${this.baseUrl}/rates`, {
        fromAddress,
        toAddress,
        package: packageDetails,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      throw new Error('Failed to fetch shipping rates');
    }
  }

  // Create shipping label
  async createShippingLabel(
    orderId: string,
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packageDetails: ShippingPackage,
    provider: ShippingProvider,
    serviceType?: string
  ): Promise<ShippingLabel> {
    try {
      const response = await api.post(`${this.baseUrl}/create-label`, {
        orderId,
        fromAddress,
        toAddress,
        package: packageDetails,
        provider,
        serviceType
      });
      return response.data;
    } catch (error) {
      console.error('Error creating shipping label:', error);
      throw new Error('Failed to create shipping label');
    }
  }

  // Track shipment
  async trackShipment(trackingNumber: string, provider?: ShippingProvider): Promise<TrackingInfo> {
    try {
      const response = await api.get(`${this.baseUrl}/track/${trackingNumber}`, {
        params: { provider }
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking shipment:', error);
      throw new Error('Failed to track shipment');
    }
  }

  // Track multiple shipments
  async trackMultipleShipments(trackingNumbers: string[]): Promise<TrackingInfo[]> {
    try {
      const response = await api.post(`${this.baseUrl}/track/bulk`, {
        trackingNumbers
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking multiple shipments:', error);
      throw new Error('Failed to track shipments');
    }
  }

  // Cancel shipment
  async cancelShipment(trackingNumber: string, reason?: string): Promise<{ success: boolean; refund?: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/cancel`, {
        trackingNumber,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling shipment:', error);
      throw new Error('Failed to cancel shipment');
    }
  }

  // Get delivery estimate
  async getDeliveryEstimate(
    fromPincode: string,
    toPincode: string,
    provider?: ShippingProvider
  ): Promise<{
    estimatedDays: number;
    estimatedDate: string;
    serviceAvailable: boolean;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/estimate`, {
        params: { fromPincode, toPincode, provider }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting delivery estimate:', error);
      throw new Error('Failed to get delivery estimate');
    }
  }

  // Check pincode serviceability
  async checkPincodeServiceability(pincode: string): Promise<{
    serviceable: boolean;
    codAvailable: boolean;
    estimatedDays: number;
    providers: ShippingProvider[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/serviceability/${pincode}`);
      return response.data;
    } catch (error) {
      console.error('Error checking pincode serviceability:', error);
      throw new Error('Failed to check pincode serviceability');
    }
  }

  // Bulk create shipping labels
  async bulkCreateLabels(request: BulkShippingRequest): Promise<{
    success: ShippingLabel[];
    failed: Array<{ orderId: string; error: string }>;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/bulk-create`, request);
      return response.data;
    } catch (error) {
      console.error('Error bulk creating labels:', error);
      throw new Error('Failed to bulk create labels');
    }
  }

  // Get shipping zones
  async getShippingZones(): Promise<ShippingZone[]> {
    try {
      const response = await api.get(`${this.baseUrl}/zones`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping zones:', error);
      throw new Error('Failed to fetch shipping zones');
    }
  }

  // Create/Update shipping zone
  async saveShippingZone(zone: Omit<ShippingZone, 'id'> & { id?: string }): Promise<ShippingZone> {
    try {
      const response = await api.post(`${this.baseUrl}/zones`, zone);
      return response.data;
    } catch (error) {
      console.error('Error saving shipping zone:', error);
      throw new Error('Failed to save shipping zone');
    }
  }

  // Get shipping rules
  async getShippingRules(): Promise<ShippingRule[]> {
    try {
      const response = await api.get(`${this.baseUrl}/rules`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping rules:', error);
      throw new Error('Failed to fetch shipping rules');
    }
  }

  // Create/Update shipping rule
  async saveShippingRule(rule: Omit<ShippingRule, 'id'> & { id?: string }): Promise<ShippingRule> {
    try {
      const response = await api.post(`${this.baseUrl}/rules`, rule);
      return response.data;
    } catch (error) {
      console.error('Error saving shipping rule:', error);
      throw new Error('Failed to save shipping rule');
    }
  }

  // Get shipping analytics
  async getShippingAnalytics(
    dateRange?: {
      startDate: string;
      endDate: string;
    }
  ): Promise<ShippingAnalytics> {
    try {
      const response = await api.get(`${this.baseUrl}/analytics`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping analytics:', error);
      throw new Error('Failed to fetch shipping analytics');
    }
  }

  // Get provider specific tracking URL
  getProviderTrackingUrl(trackingNumber: string, provider: ShippingProvider): string {
    const trackingUrls: Record<ShippingProvider, string> = {
      DELHIVERY: `https://www.delhivery.com/track/package/${trackingNumber}`,
      BLUE_DART: `https://www.bluedart.com/tracking/${trackingNumber}`,
      DTDC: `https://www.dtdc.in/tracking/${trackingNumber}`,
      FEDEX: `https://www.fedex.com/en-in/tracking.html?trknbr=${trackingNumber}`,
      EKART: `https://ekart.flipkart.com/track/${trackingNumber}`,
      INDIA_POST: `https://www.indiapost.gov.in/VAS/Pages/TrackAndTrace.aspx?TrackingNumber=${trackingNumber}`
    };
    return trackingUrls[provider] || '';
  }

  // Calculate shipping cost based on rules
  async calculateShippingCost(
    fromPincode: string,
    toPincode: string,
    weight: number,
    value: number,
    category?: string
  ): Promise<{
    cost: number;
    freeShipping: boolean;
    appliedRules: string[];
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/calculate-cost`, {
        fromPincode,
        toPincode,
        weight,
        value,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw new Error('Failed to calculate shipping cost');
    }
  }

  // Get estimated delivery date
  static getEstimatedDeliveryDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Format tracking status for display
  static formatTrackingStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'CREATED': 'Order Created',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'RETURNED': 'Returned',
      'LOST': 'Lost',
      'DAMAGED': 'Damaged'
    };
    return statusMap[status] || status;
  }

  // Get status color for UI
  static getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'CREATED': 'blue',
      'PICKED_UP': 'yellow',
      'IN_TRANSIT': 'blue',
      'OUT_FOR_DELIVERY': 'purple',
      'DELIVERED': 'green',
      'CANCELLED': 'red',
      'RETURNED': 'orange',
      'LOST': 'red',
      'DAMAGED': 'red'
    };
    return colorMap[status] || 'gray';
  }

  // Validate pincode format
  static validatePincode(pincode: string): boolean {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  }

  // Calculate volumetric weight
  static calculateVolumetricWeight(length: number, width: number, height: number): number {
    // Using standard formula: (L × W × H) / 5000 for domestic shipping
    return (length * width * height) / 5000;
  }

  // Get chargeable weight (higher of actual or volumetric)
  static getChargeableWeight(actualWeight: number, length: number, width: number, height: number): number {
    const volumetricWeight = this.calculateVolumetricWeight(length, width, height);
    return Math.max(actualWeight, volumetricWeight);
  }

  // Generate shipping manifest
  async generateManifest(
    trackingNumbers: string[],
    provider: ShippingProvider,
    pickupAddress: ShippingAddress
  ): Promise<{
    manifestId: string;
    manifestUrl: string;
    trackingNumbers: string[];
    totalShipments: number;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/generate-manifest`, {
        trackingNumbers,
        provider,
        pickupAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error generating manifest:', error);
      throw new Error('Failed to generate manifest');
    }
  }

  // Schedule pickup
  async schedulePickup(
    pickupAddress: ShippingAddress,
    trackingNumbers: string[],
    pickupDate: string,
    timeSlot: string,
    provider: ShippingProvider
  ): Promise<{
    pickupId: string;
    confirmationNumber: string;
    pickupDate: string;
    timeSlot: string;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/schedule-pickup`, {
        pickupAddress,
        trackingNumbers,
        pickupDate,
        timeSlot,
        provider
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      throw new Error('Failed to schedule pickup');
    }
  }

  // Get pickup slots
  async getPickupSlots(
    pincode: string,
    date: string,
    provider: ShippingProvider
  ): Promise<{
    date: string;
    slots: Array<{
      timeSlot: string;
      available: boolean;
      cost: number;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/pickup-slots`, {
        params: { pincode, date, provider }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup slots:', error);
      throw new Error('Failed to fetch pickup slots');
    }
  }
}

export const shippingService = new ShippingService();
export default shippingService;
