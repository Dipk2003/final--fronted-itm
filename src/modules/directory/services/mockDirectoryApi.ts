// Mock Directory API Service - For development when backend is not ready
import {
  ServiceProvider,
  DirectorySearchFilters,
  DirectorySearchResponse,
  ServiceCategory,
  DirectoryStats,
  QuoteRequest,
  ContactSupplierRequest,
  Location
} from '../types/directory';

// Mock Data
const mockServiceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Land Surveyors',
    slug: 'land-surveyors',
    description: 'Professional land surveying services',
    subCategories: [
      { id: '1a', name: 'Boundary Survey', slug: 'boundary-survey', description: '', count: 25 },
      { id: '1b', name: 'Topographic Survey', slug: 'topographic-survey', description: '', count: 18 },
      { id: '1c', name: 'Construction Survey', slug: 'construction-survey', description: '', count: 22 }
    ],
    count: 65
  },
  {
    id: '2',
    name: 'Construction Services',
    slug: 'construction-services',
    description: 'Building and construction contractors',
    subCategories: [
      { id: '2a', name: 'Residential Construction', slug: 'residential-construction', description: '', count: 45 },
      { id: '2b', name: 'Commercial Construction', slug: 'commercial-construction', description: '', count: 35 }
    ],
    count: 80
  },
  {
    id: '3',
    name: 'Engineering Consultants',
    slug: 'engineering-consultants',
    description: 'Professional engineering consultation services',
    subCategories: [],
    count: 42
  },
  {
    id: '4',
    name: 'Legal Services',
    slug: 'legal-services',
    description: 'Legal consultation and services',
    subCategories: [],
    count: 38
  },
  {
    id: '5',
    name: 'CA Services',
    slug: 'ca-services',
    description: 'Chartered Accountant services',
    subCategories: [],
    count: 28
  }
];

const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Land Surveyors Service, Surveyor PD Consulting Engineers Private Limited',
    description: 'We are providing professional land surveying services with 15+ years of experience. Our team uses latest surveying equipment and technology to provide accurate results. We specialize in boundary surveys, topographic surveys, and construction layout services.',
    category: 'Land Surveyors',
    subCategory: 'Boundary Survey',
    location: {
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      address: 'Boring Road, Patna',
      coordinates: { lat: 25.5941, lng: 85.1376 }
    },
    contact: {
      mobile: '+91 9876543210',
      phone: '0612-2345678',
      email: 'rajesh@pdconsulting.com',
      website: 'www.pdconsulting.com'
    },
    rating: {
      average: 4.5,
      count: 51,
      reviews: []
    },
    verification: {
      isGSTVerified: true,
      isTrustSEALVerified: true,
      isVerifiedSupplier: true,
      yearsInBusiness: 15
    },
    responseRate: 70,
    services: ['Land Surveying', 'Boundary Survey', 'Topographic Survey'],
    specializations: ['GPS Survey', 'Total Station Survey', 'Drone Survey'],
    certifications: ['Licensed Surveyor', 'ISO 9001'],
    images: [],
    establishmentYear: 2008,
    employeeCount: '10-25',
    turnover: '50L-1Cr',
    tags: ['Professional', 'Experienced', 'Latest Equipment'],
    isActive: true,
    isPremium: true,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Amit Singh',
    businessName: 'Land Topographical Survey Service, Shiva Construction',
    description: 'Providing comprehensive land surveying and topographical survey services in Patna and surrounding areas. We have modern equipment and experienced team.',
    category: 'Land Surveyors',
    location: {
      city: 'Patna',
      state: 'Bihar',
      pincode: '800014',
      address: 'Kankarbagh, Patna'
    },
    contact: {
      mobile: '+91 9845612378',
      email: 'amit@shivaconstruction.com'
    },
    rating: {
      average: 4.0,
      count: 28,
      reviews: []
    },
    verification: {
      isGSTVerified: true,
      isTrustSEALVerified: false,
      isVerifiedSupplier: true,
      yearsInBusiness: 8
    },
    responseRate: 85,
    services: ['Topographical Survey', 'Construction Survey'],
    specializations: ['Digital Mapping', 'Contour Survey'],
    certifications: [],
    images: [],
    establishmentYear: 2015,
    tags: ['Reliable', 'Quick Service'],
    isActive: true,
    isPremium: false,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Priya Sharma',
    businessName: 'Hiring of DGPS Machine with Surveyor, E Surveying Engineering Consultancy',
    description: 'Modern surveying services using DGPS technology. We provide accurate and reliable surveying solutions for construction and infrastructure projects.',
    category: 'Land Surveyors',
    location: {
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      address: 'Sector 62, Noida'
    },
    contact: {
      mobile: '+91 9123456789',
      email: 'priya@esurveying.com'
    },
    rating: {
      average: 4.2,
      count: 15,
      reviews: []
    },
    verification: {
      isGSTVerified: true,
      isTrustSEALVerified: false,
      isVerifiedSupplier: false,
      yearsInBusiness: 5
    },
    responseRate: 90,
    services: ['DGPS Survey', 'Land Survey', 'Engineering Survey'],
    specializations: ['DGPS Technology', 'GIS Mapping'],
    certifications: ['DGPS Certified'],
    images: [],
    establishmentYear: 2018,
    tags: ['Modern Equipment', 'DGPS Technology'],
    isActive: true,
    isPremium: false,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Vikram Gupta',
    businessName: 'Land Surveying Service, Prans Infra Service Limited',
    description: 'Professional land surveying services with expertise in all types of surveys. We serve clients across Bihar and surrounding states.',
    category: 'Land Surveyors',
    location: {
      city: 'Patna',
      state: 'Bihar',
      pincode: '800020',
      address: 'Chandi Vyapar Bhawan, Patna'
    },
    contact: {
      mobile: '+91 9234567891',
      email: 'vikram@pransinfra.com'
    },
    rating: {
      average: 3.8,
      count: 32,
      reviews: []
    },
    verification: {
      isGSTVerified: true,
      isTrustSEALVerified: false,
      isVerifiedSupplier: true,
      yearsInBusiness: 12
    },
    responseRate: 75,
    services: ['Land Survey', 'Construction Layout', 'Boundary Survey'],
    specializations: ['Large Scale Projects', 'Government Projects'],
    certifications: ['Government Approved'],
    images: [],
    establishmentYear: 2011,
    tags: ['Government Projects', 'Large Scale'],
    isActive: true,
    isPremium: false,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockLocations: Location[] = [
  { id: '1', name: 'Patna', type: 'city', count: 150 },
  { id: '2', name: 'Delhi', type: 'city', count: 250 },
  { id: '3', name: 'Noida', type: 'city', count: 180 },
  { id: '4', name: 'Mumbai', type: 'city', count: 200 },
  { id: '5', name: 'Bangalore', type: 'city', count: 190 },
];

// Mock API Implementation
export class MockDirectoryApiService {
  
  async searchServiceProviders(filters: DirectorySearchFilters): Promise<DirectorySearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredProviders = [...mockServiceProviders];

    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredProviders = filteredProviders.filter(provider =>
        provider.businessName.toLowerCase().includes(query) ||
        provider.category.toLowerCase().includes(query) ||
        provider.services.some(service => service.toLowerCase().includes(query))
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filteredProviders = filteredProviders.filter(provider =>
        provider.location.city.toLowerCase().includes(location) ||
        provider.location.state.toLowerCase().includes(location)
      );
    }

    // Filter by category
    if (filters.category) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.category === filters.category
      );
    }

    // Filter by rating
    if (filters.rating) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.rating.average >= filters.rating!
      );
    }

    // Filter by response rate
    if (filters.responseRate) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.responseRate >= filters.responseRate!
      );
    }

    // Filter by verification
    if (filters.isGSTVerified) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.verification.isGSTVerified
      );
    }

    if (filters.isTrustSEALVerified) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.verification.isTrustSEALVerified
      );
    }

    if (filters.isVerifiedSupplier) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.verification.isVerifiedSupplier
      );
    }

    // Sort results
    if (filters.sortBy) {
      filteredProviders.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        
        switch (filters.sortBy) {
          case 'rating':
            return (a.rating.average - b.rating.average) * order;
          case 'responseRate':
            return (a.responseRate - b.responseRate) * order;
          case 'yearsInBusiness':
            return (a.verification.yearsInBusiness - b.verification.yearsInBusiness) * order;
          case 'name':
            return a.businessName.localeCompare(b.businessName) * order;
          default:
            return 0;
        }
      });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProviders = filteredProviders.slice(startIndex, endIndex);
    
    return {
      providers: paginatedProviders,
      total: filteredProviders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProviders.length / limit),
      filters: {
        categories: mockServiceCategories,
        locations: mockLocations,
        priceRange: { min: 5000, max: 500000 }
      }
    };
  }

  async getServiceProvider(id: string): Promise<ServiceProvider> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const provider = mockServiceProviders.find(p => p.id === id);
    if (!provider) {
      throw new Error('Service provider not found');
    }
    
    return provider;
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockServiceCategories;
  }

  async getLocations(): Promise<Location[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLocations;
  }

  async getProvidersByLocationAndCategory(city: string, category?: string): Promise<ServiceProvider[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = mockServiceProviders.filter(p => 
      p.location.city.toLowerCase() === city.toLowerCase()
    );

    if (category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    return filtered;
  }

  async getDirectoryStats(): Promise<DirectoryStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalProviders: 1250,
      totalCategories: 15,
      totalCities: 50,
      averageRating: 4.2,
      totalReviews: 3420
    };
  }

  async submitQuoteRequest(quoteRequest: QuoteRequest): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Mock: Quote request submitted:', quoteRequest);
    
    return {
      success: true,
      message: 'Your quote request has been submitted successfully! We will get back to you soon.'
    };
  }

  async contactSupplier(contactRequest: ContactSupplierRequest): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Mock: Contact request submitted:', contactRequest);
    
    return {
      success: true,
      message: 'Your inquiry has been sent to the supplier successfully!'
    };
  }

  async getFeaturedProviders(limit: number = 10): Promise<ServiceProvider[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockServiceProviders
      .filter(p => p.isPremium)
      .slice(0, limit);
  }

  async getTopRatedProviders(category: string, limit: number = 5): Promise<ServiceProvider[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockServiceProviders
      .filter(p => p.category === category)
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limit);
  }

  async getProvidersByCity(city: string, limit: number = 20): Promise<ServiceProvider[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockServiceProviders
      .filter(p => p.location.city.toLowerCase() === city.toLowerCase())
      .slice(0, limit);
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const suggestions = [
      'Land Survey in Noida',
      'Land Survey in Delhi',
      'Land Survey in Patna',
      'Construction Services',
      'Engineering Consultants',
      'Legal Services',
      'CA Services',
      'Topographic Survey',
      'Boundary Survey',
      'DGPS Survey'
    ];

    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }

  async getPopularSearches(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      'Land Survey in Noida',
      'Construction Services in Delhi',
      'CA Services in Mumbai',
      'Legal Services in Bangalore',
      'Engineering Consultants'
    ];
  }
}

// Export singleton instance
export const mockDirectoryApi = new MockDirectoryApiService();
