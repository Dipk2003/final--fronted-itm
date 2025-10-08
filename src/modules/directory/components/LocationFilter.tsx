'use client';

import React, { useState, useEffect } from 'react';
import { Location } from '../types/directory';
import { directoryApi } from '../services/directoryApi';
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationFilterProps {
  selectedLocation?: string;
  onLocationChange: (location: string) => void;
  className?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation = '',
  onLocationChange,
  className = ''
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedLocation);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    setSearchTerm(selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const locationData = await directoryApi.getLocations();
      setLocations(locationData);
      setFilteredLocations(locationData);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSearchTerm(location.name);
    onLocationChange(location.name);
    setIsOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    onLocationChange(value);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Enter city or location"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-10 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading locations...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No locations found</div>
          ) : (
            <>
              {/* Popular Cities */}
              {!searchTerm && (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-100">
                    Popular Cities
                  </div>
                  {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
                    .map((city) => (
                      <button
                        key={city}
                        onClick={() => handleLocationSelect({ id: city, name: city, type: 'city', count: 0 })}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 flex items-center justify-between"
                      >
                        <span>{city}</span>
                        <span className="text-sm text-blue-600">Popular</span>
                      </button>
                    ))
                  }
                  {locations.length > 0 && (
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-100">
                      All Locations
                    </div>
                  )}
                </>
              )}

              {/* Filtered Locations */}
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 flex items-center justify-between"
                >
                  <span>{location.name}</span>
                  {location.count > 0 && (
                    <span className="text-sm text-gray-500">
                      {location.count} providers
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationFilter;
