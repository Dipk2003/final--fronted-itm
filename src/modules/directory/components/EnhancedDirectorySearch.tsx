'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Building, Globe } from 'lucide-react';
import { Button } from '@/shared/components';

interface EnhancedDirectorySearchProps {
  onSearch: (service: string, state: string, city: string) => void;
  onDirectSearch?: (query: string, location: string) => void;
}

interface LocationData {
  states: { [key: string]: string[] };
  services: string[];
}

const EnhancedDirectorySearch: React.FC<EnhancedDirectorySearchProps> = ({
  onSearch,
  onDirectSearch
}) => {
  // State management
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Dropdown states
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  // Direct search states
  const [directQuery, setDirectQuery] = useState('');
  const [directLocation, setDirectLocation] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'structured' | 'direct'>('structured');

  // Mock data - Replace with API calls
  const locationData: LocationData = {
    states: {
      'Uttar Pradesh': ['Noida', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut'],
      'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Gulbarga'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner', 'Kota'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
      'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
      'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar'],
      'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
      'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
      'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam']
    },
    services: [
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
      'Property Dealers',
      'Real Estate Agents',
      'Building Contractors',
      'Civil Engineers',
      'Electrical Contractors',
      'Plumbing Services',
      'Painting Contractors',
      'Security Services',
      'Cleaning Services'
    ]
  };

  const handleStructuredSearch = () => {
    if (selectedService && selectedState && selectedCity) {
      onSearch(selectedService, selectedState, selectedCity);
    }
  };

  const handleDirectSearchSubmit = () => {
    if (onDirectSearch && (directQuery || directLocation)) {
      onDirectSearch(directQuery, directLocation);
    }
  };

  const resetSelections = () => {
    setSelectedService('');
    setSelectedState('');
    setSelectedCity('');
  };

  const availableCities = selectedState ? locationData.states[selectedState] || [] : [];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Type Tabs */}
      <div className="flex mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <button
          onClick={() => setActiveTab('structured')}
          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'structured'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Building className="inline-block w-4 h-4 mr-2" />
          Service → State → City
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'direct'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Search className="inline-block w-4 h-4 mr-2" />
          Direct Search
        </button>
      </div>

      {activeTab === 'structured' ? (
        /* Structured Search */
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Find Service Providers Step by Step
            </h2>
            <p className="text-gray-600">
              Select service type, then state, and finally city to find the best providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Service Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Select Service Type
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowServiceDropdown(!showServiceDropdown);
                    setShowStateDropdown(false);
                    setShowCityDropdown(false);
                  }}
                  className={`w-full p-3 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedService ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedService ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedService || 'Choose a service...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showServiceDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto">
                    {locationData.services.map((service, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedService(service);
                          setShowServiceDropdown(false);
                          setSelectedState('');
                          setSelectedCity('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* State Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Select State
              </label>
              <div className="relative">
                <button
                  disabled={!selectedService}
                  onClick={() => {
                    if (selectedService) {
                      setShowStateDropdown(!showStateDropdown);
                      setShowServiceDropdown(false);
                      setShowCityDropdown(false);
                    }
                  }}
                  className={`w-full p-3 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !selectedService 
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                      : selectedState 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={
                      !selectedService 
                        ? 'text-gray-400' 
                        : selectedState 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                    }>
                      {!selectedService 
                        ? 'First select service...' 
                        : selectedState || 'Choose a state...'
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showStateDropdown && selectedService && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto">
                    {Object.keys(locationData.states).map((state, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedState(state);
                          setShowStateDropdown(false);
                          setSelectedCity('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* City Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Select City
              </label>
              <div className="relative">
                <button
                  disabled={!selectedState}
                  onClick={() => {
                    if (selectedState) {
                      setShowCityDropdown(!showCityDropdown);
                      setShowServiceDropdown(false);
                      setShowStateDropdown(false);
                    }
                  }}
                  className={`w-full p-3 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !selectedState 
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                      : selectedCity 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={
                      !selectedState 
                        ? 'text-gray-400' 
                        : selectedCity 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                    }>
                      {!selectedState 
                        ? 'First select state...' 
                        : selectedCity || 'Choose a city...'
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showCityDropdown && selectedState && availableCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto">
                    {availableCities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 border-b border-gray-100 last:border-b-0"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedService ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>1</div>
              <div className={`w-8 h-1 ${selectedService ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedState ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>2</div>
              <div className={`w-8 h-1 ${selectedState ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedCity ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>3</div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center gap-4">
            {(selectedService || selectedState || selectedCity) && (
              <Button
                onClick={resetSelections}
                variant="outline"
                className="px-6 py-3"
              >
                Reset Selection
              </Button>
            )}
            <Button
              onClick={handleStructuredSearch}
              disabled={!selectedService || !selectedState || !selectedCity}
              className={`px-8 py-3 font-semibold transition-colors ${
                selectedService && selectedState && selectedCity
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Find {selectedService ? selectedService : 'Service Providers'} 
              {selectedCity && ` in ${selectedCity}`}
            </Button>
          </div>

          {/* Current Selection Display */}
          {(selectedService || selectedState || selectedCity) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Selection:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedService && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Service: {selectedService}
                  </span>
                )}
                {selectedState && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    State: {selectedState}
                  </span>
                )}
                {selectedCity && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    City: {selectedCity}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Direct Search */
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search Directly
            </h2>
            <p className="text-gray-600">
              Enter your service and location requirements directly
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter product / service to search (e.g., Land Survey)"
                  value={directQuery}
                  onChange={(e) => setDirectQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter city (e.g., Patna, Delhi, Noida)"
                  value={directLocation}
                  onChange={(e) => setDirectLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <Button
              onClick={handleDirectSearchSubmit}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Get Best Price
            </Button>
          </div>

          {/* Example searches */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Land Survey in Patna', 'Construction Services in Delhi', 'CA Services in Mumbai'].map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const [service, , location] = example.split(' in ');
                    setDirectQuery(service);
                    setDirectLocation(location);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showServiceDropdown || showStateDropdown || showCityDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowServiceDropdown(false);
            setShowStateDropdown(false);
            setShowCityDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedDirectorySearch;
