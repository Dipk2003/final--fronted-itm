'use client';

import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

// City images - Import actual uploaded images
import city1 from '@/assets/Topcity/city1.jpg';
import city2 from '@/assets/Topcity/city2.jpg';
import city3 from '@/assets/Topcity/city3.jpg';
import city4 from '@/assets/Topcity/city4.jpg';
import city5 from '@/assets/Topcity/city5.jpg';
import city6 from '@/assets/Topcity/city6.jpg';
import city7 from '@/assets/Topcity/city7.jpg';
import city8 from '@/assets/Topcity/city8.jpg';
import city9 from '@/assets/Topcity/city9.jpg';
import city10 from '@/assets/Topcity/city10.jpg';

// Types
interface City {
  id: string;
  name: string;
  image: StaticImageData;
  supplierCount: number;
  href: string;
}

// City data with imported images
const cities: City[] = [
  { id: 'delhi', name: 'Delhi', image: city3, supplierCount: 9680, href: '/city/Delhi' },
  { id: 'noida', name: 'Noida', image: city4, supplierCount: 18750, href: '/city/Noida' },
  { id: 'ghaziadad', name: 'Ghaziabad', image: city9, supplierCount: 5670, href: '/city/Ghaziabad' },
  { id: 'jaipur', name: 'Jaipur', image: city10, supplierCount: 10300, href: '/city/Jaipur' },
  { id: 'mumbai', name: 'Mumbai', image: city1, supplierCount: 15420, href: '/city/Mumbai' },
  { id: 'chennai', name: 'Chennai', image: city2, supplierCount: 12850, href: '/city/bengaluru' },
  { id: 'bengaluru', name: 'Bengaluru', image: city7, supplierCount: 11200, href: '/city/Bengaluru' },
  { id: 'hyderabad', name: 'Hyderabad', image: city6, supplierCount: 7340, href: '/city/Hyderabad' },
  { id: 'ahmedabad', name: 'Ahmedabad', image: city5, supplierCount: 8920, href: '/city/ahmedabad' },
  { id: 'surat', name: 'Surat', image: city8, supplierCount: 6890, href: '/city/surat' },
  
];

// Helper function to format supplier count
const formatSupplierCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return `${count}+`;
};

const TopCities: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Suppliers from Top Cities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with verified suppliers across India's major business hubs
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {cities.map((city) => (
            <a
              key={city.id}
              href={city.href}
              className="group flex flex-col items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-indigo-200"
            >
              {/* City Image */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 overflow-hidden rounded-full ring-4 ring-gray-100 group-hover:ring-indigo-200 transition-all duration-300">
                <Image
                  src={city.image}
                  alt={`${city.name} suppliers`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* City Name */}
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                {city.name}
              </h3>
              
              {/* Supplier Count */}
              <p className="text-xs md:text-sm text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                {formatSupplierCount(city.supplierCount)} suppliers
              </p>
              
              {/* Hover indicator */}
              <div className="w-0 group-hover:w-8 h-0.5 bg-indigo-500 transition-all duration-300 mt-2" />
            </a>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/cities"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            View All Cities
            <svg 
              className="ml-2 -mr-1 w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopCities;
