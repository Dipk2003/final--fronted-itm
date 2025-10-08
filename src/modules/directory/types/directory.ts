export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  location: {
    city: string;
    state: string;
    pincode: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    mobile: string;
    phone?: string;
    email: string;
    website?: string;
  };
  rating: {
    average: number;
    count: number;
    reviews: Review[];
  };
  verification: {
    isGSTVerified: boolean;
    isTrustSEALVerified: boolean;
    isVerifiedSupplier: boolean;
    yearsInBusiness: number;
  };
  responseRate: number;
  services: string[];
  specializations: string[];
  certifications: string[];
  images: string[];
  establishmentYear: number;
  employeeCount?: string;
  turnover?: string;
  tags: string[];
  isActive: boolean;
  isPremium: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  subCategories: SubCategory[];
  count: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface DirectorySearchFilters {
  query?: string;
  category?: string;
  subCategory?: string;
  location?: string;
  city?: string;
  state?: string;
  rating?: number;
  responseRate?: number;
  isGSTVerified?: boolean;
  isTrustSEALVerified?: boolean;
  isVerifiedSupplier?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'relevance' | 'rating' | 'responseRate' | 'yearsInBusiness' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DirectorySearchResponse {
  providers: ServiceProvider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    categories: ServiceCategory[];
    locations: Location[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export interface Location {
  id: string;
  name: string;
  type: 'city' | 'state' | 'country';
  parent?: string;
  count: number;
}

export interface DirectoryStats {
  totalProviders: number;
  totalCategories: number;
  totalCities: number;
  averageRating: number;
  totalReviews: number;
}

export interface QuoteRequest {
  id?: string;
  serviceType: string;
  location: string;
  description: string;
  budget?: string;
  timeline: string;
  contactInfo: {
    name: string;
    mobile: string;
    email: string;
  };
  requirements: string;
  createdAt?: Date;
}

export interface ContactSupplierRequest {
  providerId: string;
  message: string;
  contactInfo: {
    name: string;
    mobile: string;
    email?: string;
    company?: string;
  };
  serviceRequired: string;
  location: string;
  timeline?: string;
  budget?: string;
}
