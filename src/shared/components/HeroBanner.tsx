'use client';

import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function HeroBanner() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGetStarted = () => {
    router.push('/auth/user/register');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-green-500 text-white pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-sm">
          Empowering Businesses with Smart Technology
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90">
          Explore innovative solutions and services tailored to your industry. Indian Trade Mart is your gateway to digital transformation.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products, services, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-full border-0 shadow-lg focus:ring-4 focus:ring-white/30 text-lg text-gray-800 placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        <button 
          onClick={handleGetStarted}
          className="mt-6 px-8 py-3 bg-white text-blue-700 rounded-full text-base font-semibold hover:bg-gray-100 shadow transition duration-300 flex items-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          Get Started
        </button>
      </div>

      {/* Background decorations */}
      <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-8 -left-8 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}

