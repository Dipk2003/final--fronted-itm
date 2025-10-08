'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EnhancedDirectorySearch from './EnhancedDirectorySearch';
import ServiceProviderList from './ServiceProviderList';
import LocalSellers from './LocalSellers';
import { directoryApi } from '../services/directoryApi';
import {
  ServiceProvider,
  DirectorySearchFilters,
  DirectorySearchResponse,
  ContactSupplierRequest
} from '../types/directory';
import { Dialog } from '@/shared/components';
import { Phone, MessageCircle, X } from 'lucide-react';

interface DirectoryPageProps {
  initialQuery?: string;
  initialLocation?: string;
  initialCategory?: string;
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({
  initialQuery = '',
  initialLocation = '',
  initialCategory = ''
}) => {
  const [searchResults, setSearchResults] = useState<DirectorySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<DirectorySearchFilters>({
    query: initialQuery,
    location: initialLocation,
    category: initialCategory,
    page: 1,
    limit: 10,
    sortBy: 'relevance'
  });

  // Contact modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    message: '',
    serviceRequired: '',
    timeline: '',
    budget: ''
  });

  // Handler for direct search (query, location)
  const handleDirectSearch = useCallback(async (query: string, location: string) => {
    setIsLoading(true);
    setError(null);

    const filters: DirectorySearchFilters = {
      ...currentFilters,
      query: query.trim(),
      location: location.trim(),
      page: 1
    };

    setCurrentFilters(filters);

    try {
      const results = await directoryApi.searchServiceProviders(filters);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search service providers');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]);

  // Legacy handler for compatibility with popular categories
  const handleSearch = useCallback(async (query: string, location: string, category?: string) => {
    return handleDirectSearch(query, location);
  }, [handleDirectSearch]);

  useEffect(() => {
    // Load initial search if query or location is provided
    if (initialQuery || initialLocation) {
      handleSearch(initialQuery, initialLocation, initialCategory);
    }
  }, [initialQuery, initialLocation, initialCategory, handleSearch]);

  // Handler for structured search (service, state, city)
  const handleStructuredSearch = async (service: string, state: string, city: string) => {
    setIsLoading(true);
    setError(null);

    const filters: DirectorySearchFilters = {
      ...currentFilters,
      query: service.trim(),
      location: `${city.trim()}, ${state.trim()}`,
      category: service.trim(),
      page: 1
    };

    setCurrentFilters(filters);

    try {
      const results = await directoryApi.searchServiceProviders(filters);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search service providers');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: DirectorySearchFilters) => {
    setIsLoading(true);
    setError(null);
    setCurrentFilters(newFilters);

    try {
      const results = await directoryApi.searchServiceProviders(newFilters);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to filter service providers');
      console.error('Filter error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ ...currentFilters, page });
  };

  const handleViewMobileNumber = async (providerId: string) => {
    try {
      const provider = await directoryApi.getServiceProvider(providerId);
      setSelectedProvider(provider);
      setShowMobileModal(true);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      alert('Unable to load mobile number. Please try again.');
    }
  };

  const handleContactSupplier = async (providerId: string) => {
    try {
      const provider = await directoryApi.getServiceProvider(providerId);
      setSelectedProvider(provider);
      setContactForm(prev => ({
        ...prev,
        serviceRequired: provider.category
      }));
      setShowContactModal(true);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      alert('Unable to load contact form. Please try again.');
    }
  };

  const handleContactSubmit = async () => {
    if (!selectedProvider || !contactForm.name || !contactForm.mobile) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const contactRequest: ContactSupplierRequest = {
        providerId: selectedProvider.id,
        message: contactForm.message,
        contactInfo: {
          name: contactForm.name,
          mobile: contactForm.mobile,
          email: contactForm.email,
          company: contactForm.company
        },
        serviceRequired: contactForm.serviceRequired,
        location: currentFilters.location || '',
        timeline: contactForm.timeline,
        budget: contactForm.budget
      };

      await directoryApi.contactSupplier(contactRequest);
      alert('Your inquiry has been sent successfully!');
      setShowContactModal(false);
      setContactForm({
        name: '',
        mobile: '',
        email: '',
        company: '',
        message: '',
        serviceRequired: '',
        timeline: '',
        budget: ''
      });
    } catch (err: any) {
      alert(err.message || 'Failed to send inquiry. Please try again.');
    }
  };

  const hasSearched = currentFilters.query || currentFilters.location;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <EnhancedDirectorySearch
            onSearch={handleStructuredSearch}
            onDirectSearch={handleDirectSearch}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search Results or Default Content */}
        {hasSearched ? (
          searchResults && (
            <ServiceProviderList
              providers={searchResults.providers}
              total={searchResults.total}
              currentPage={searchResults.page}
              totalPages={searchResults.totalPages}
              filters={currentFilters}
              isLoading={isLoading}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onContactSupplier={handleContactSupplier}
              onViewMobileNumber={handleViewMobileNumber}
              searchQuery={currentFilters.query}
              searchLocation={currentFilters.location}
            />
          )
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area when no search */}
            <div className="lg:col-span-2 space-y-8">
              {/* Popular Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Service Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'Land Surveyors',
                    'Construction Services',
                    'Engineering Consultants',
                    'Architectural Services',
                    'Interior Designers',
                    'Legal Services',
                    'CA Services',
                    'IT Services',
                    'Digital Marketing',
                    'Transportation Services',
                    'Accounting Services',
                    'Property Dealers'
                  ].map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(category, '')}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{category}</div>
                      <div className="text-sm text-gray-500 mt-1">Find providers</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 text-2xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
                    <p className="text-gray-600 text-sm">Search for the service you need in your location</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Compare</h3>
                    <p className="text-gray-600 text-sm">Compare providers based on ratings, reviews, and experience</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 text-2xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
                    <p className="text-gray-600 text-sm">Contact the best providers and get your work done</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <LocalSellers />
              
              {/* Popular Cities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Cities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Delhi', 'Mumbai', 'Bangalore', 'Chennai',
                    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
                    'Noida', 'Gurgaon', 'Jaipur', 'Lucknow'
                  ].map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch('', city)}
                      className="text-left text-blue-600 hover:text-blue-800 py-1 text-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Supplier Modal */}
        <Dialog open={showContactModal} onOpenChange={(open) => setShowContactModal(open)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Contact Supplier</h3>
              <button onClick={() => setShowContactModal(false)}>
                <X size={20} />
              </button>
            </div>

            {selectedProvider && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedProvider.businessName}</h4>
                <p className="text-sm text-gray-600">
                  {selectedProvider.location.city}, {selectedProvider.location.state}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    value={contactForm.mobile}
                    onChange={(e) => setContactForm(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Required
                </label>
                <input
                  type="text"
                  value={contactForm.serviceRequired}
                  onChange={(e) => setContactForm(prev => ({ ...prev, serviceRequired: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={contactForm.timeline}
                    onChange={(e) => setContactForm(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="Urgent (within a week)">Urgent (within a week)</option>
                    <option value="Within a month">Within a month</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="Not urgent">Not urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={contactForm.budget}
                    onChange={(e) => setContactForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select budget</option>
                    <option value="Under ₹10,000">Under ₹10,000</option>
                    <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleContactSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </Dialog>

        {/* Mobile Number Modal */}
        <Dialog open={showMobileModal} onOpenChange={(open) => setShowMobileModal(open)}>
          <div className="p-6 text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact Details</h3>
              <button onClick={() => setShowMobileModal(false)}>
                <X size={20} />
              </button>
            </div>

            {selectedProvider && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedProvider.businessName}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedProvider.location.city}, {selectedProvider.location.state}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-lg font-medium">
                    <Phone size={20} className="text-blue-600" />
                    <span>{selectedProvider.contact.mobile}</span>
                  </div>
                  
                  {selectedProvider.contact.phone && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{selectedProvider.contact.phone}</span>
                    </div>
                  )}

                  {selectedProvider.contact.email && (
                    <div className="text-sm text-gray-600">
                      <strong>Email:</strong> {selectedProvider.contact.email}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Please mention Indian Trade Mart when you call
                  </p>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default DirectoryPage;
