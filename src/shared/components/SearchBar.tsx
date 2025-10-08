'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { api } from '@/lib/api';

interface SearchResult {
  id: string;
  name: string;
  type: 'product' | 'category' | 'vendor';
  price?: number;
  image?: string;
}

interface Props {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ placeholder = "Search products, categories, vendors...", onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
      setResults(response.data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        searchProducts();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        window.location.href = `/products?search=${encodeURIComponent(query)}`;
      }
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    if (result.type === 'product') {
      window.location.href = `/products/${result.id}`;
    } else if (result.type === 'category') {
      window.location.href = `/products?category=${result.id}`;
    } else if (result.type === 'vendor') {
      window.location.href = `/browse-vendors/${result.id}`;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query.length > 2) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
                >
                  {result.image && (
                    <Image
                      src={result.image}
                      alt={result.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{result.type}</div>
                    {result.price && (
                      <div className="text-sm text-indigo-600 font-semibold">
                        ₹{result.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
