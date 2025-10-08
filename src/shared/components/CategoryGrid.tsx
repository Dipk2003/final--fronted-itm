'use client'

import { Factory, Zap, Coffee, Heart, Shirt, Shield, Monitor, Hammer, TrendingUp, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react';
import { api } from '@/shared/utils/apiClient';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  productCount?: number;
  href: string;
}

const iconMap = {
  factory: Factory,
  monitor: Monitor,
  zap: Zap,
  coffee: Coffee,
  shield: Shield,
  shirt: Shirt,
  hammer: Hammer,
  heart: Heart,
};

const colorMap = [
  'bg-green-50 text-green-600 border-green-200',
  'bg-blue-50 text-blue-600 border-blue-200',
  'bg-yellow-50 text-yellow-600 border-yellow-200',
  'bg-gray-50 text-gray-600 border-gray-200',
  'bg-orange-50 text-orange-600 border-orange-200',
  'bg-red-50 text-red-600 border-red-200',
  'bg-purple-50 text-purple-600 border-purple-200',
  'bg-pink-50 text-pink-600 border-pink-200',
];

export default function CategoryGrid() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching categories from:', '/api/categories');
      
      // Use fetch directly to avoid authentication issues
      // Add a small delay to avoid API rate limiting issues
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to fetch categories from API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/categories`;
      console.log(`Fetching from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).catch(error => {
        console.error('Network error when fetching categories:', error);
        throw new Error('Network error when fetching categories');
      });
      
      if (!response.ok) {
        console.error(`API Error: HTTP ${response.status} when fetching categories`);
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Unknown error'}`);
      }
      
      const data = await response.json();
        console.log('✅ Categories fetched:', data);
        
        // Transform backend data to frontend format
        if (data && Array.isArray(data) && data.length > 0) {
          const transformedCategories: Category[] = data.slice(0, 6).map((cat: any, index: number) => ({
            id: cat.id || index + 1,
            title: cat.name || cat.title || 'Category',
            description: cat.description || 'Explore products in this category',
            icon: iconMap.factory, // Default icon, can be made dynamic
            color: colorMap[index % colorMap.length],
            productCount: cat.productCount || 0,
            href: `/categories/${cat.id || index + 1}`
          }));
          
          setCategories(transformedCategories);
          setError(null);
        } else {
          console.warn('⚠️ Backend returned no categories, showing fallback categories');
          // Provide fallback categories instead of error
          const fallbackCategories: Category[] = [
            {
              id: 1,
              title: 'Manufacturing',
              description: 'Industrial manufacturing solutions',
              icon: iconMap.factory,
              color: colorMap[0],
              productCount: 120,
              href: '/categories/1'
            },
            {
              id: 2,
              title: 'Electronics',
              description: 'Electronic components and devices',
              icon: iconMap.zap,
              color: colorMap[1],
              productCount: 85,
              href: '/categories/2'
            },
            {
              id: 3,
              title: 'Food & Beverage',
              description: 'Food processing and beverages',
              icon: iconMap.coffee,
              color: colorMap[2],
              productCount: 65,
              href: '/categories/3'
            },
            {
              id: 4,
              title: 'Healthcare',
              description: 'Medical and healthcare products',
              icon: iconMap.heart,
              color: colorMap[3],
              productCount: 95,
              href: '/categories/4'
            },
            {
              id: 5,
              title: 'Textiles',
              description: 'Textile and apparel solutions',
              icon: iconMap.shirt,
              color: colorMap[4],
              productCount: 75,
              href: '/categories/5'
            },
            {
              id: 6,
              title: 'Security',
              description: 'Security and safety equipment',
              icon: iconMap.shield,
              color: colorMap[5],
              productCount: 45,
              href: '/categories/6'
            }
          ];
          setCategories(fallbackCategories);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err);
        // Show error message without fallback categories
        setCategories([]);
        setError('Unable to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewAllCategories = () => {
    router.push('/categories');
  };

  const handleCategoryClick = (category: Category) => {
    router.push(category.href);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Browse by Category</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover innovative solutions and services tailored to your business needs across various industries.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${category.color} hover:scale-105`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      {category.description}
                    </p>
                    {category.productCount && (
                      <p className="text-xs text-indigo-600 font-semibold mt-1">
                        {category.productCount}+ products
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
        
        {/* View all categories button */}
        <div className="text-center">
          <button 
            onClick={handleViewAllCategories}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            View all categories
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
