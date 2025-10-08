'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/shared/utils/apiClient';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  vendor?: {
    name: string;
    location?: string;
  };
  inStock: boolean;
}

export default function ProductGrid() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching featured products from:', '/api/products/featured');
        
        // Use fetch directly to avoid authentication issues
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/featured`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Featured products fetched:', data);
        
        // Transform backend data to frontend format
        if (Array.isArray(data) && data.length > 0) {
          const transformedProducts: Product[] = data.slice(0, 6).map((product: any) => ({
            id: product.id,
            name: product.name || product.title,
            description: product.description || product.shortDescription,
            price: product.price || product.sellingPrice,
            originalPrice: product.originalPrice || product.mrp,
            imageUrl: product.imageUrl || product.images?.[0]?.url,
            category: product.category?.name || 'General',
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || 0,
            vendor: {
              name: product.vendor?.name || 'Verified Vendor',
              location: product.vendor?.city || 'India'
            },
            inStock: product.inStock !== false
          }));
          
          setProducts(transformedProducts);
          setError(null);
        } else {
          console.log('⚠️ No featured products found, using fallback');
          throw new Error('No featured products found');
        }
      } catch (err) {
        console.error('❌ Failed to fetch featured products:', err);
        // Fallback to sample products
        setProducts([
          {
            id: 1,
            name: 'Industrial Machinery',
            description: 'High-quality industrial machinery for manufacturing',
            price: 250000,
            originalPrice: 300000,
            category: 'Industrial',
            rating: 4.5,
            reviewCount: 24,
            vendor: { name: 'TechnoMart Industries', location: 'Mumbai' },
            inStock: true
          },
          {
            id: 2,
            name: 'Agricultural Equipment',
            description: 'Modern farming equipment for enhanced productivity',
            price: 150000,
            category: 'Agriculture',
            rating: 4.7,
            reviewCount: 18,
            vendor: { name: 'FarmTech Solutions', location: 'Delhi' },
            inStock: true
          },
          {
            id: 3,
            name: 'Electronic Components',
            description: 'Premium electronic components for various applications',
            price: 5000,
            originalPrice: 6000,
            category: 'Electronics',
            rating: 4.3,
            reviewCount: 56,
            vendor: { name: 'ElectroMart', location: 'Bangalore' },
            inStock: true
          }
        ]);
        setError(`Failed to load products: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/api/buyer/cart/add', { productId, quantity: 1 });
      // Show success notification
      console.log('Product added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/api/buyer/wishlist/add', { productId });
      // Show success notification
      console.log('Product added to wishlist');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
                <div className="h-44 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Featured Products</h2>
      <p className="text-gray-500 mb-10 max-w-xl mx-auto">
        Hand-picked solutions to power your business growth — quality guaranteed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer relative"
          >
            {/* Product Image */}
            <div className="h-44 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-gray-400 group-hover:text-gray-500 transition">No Image</span>
              )}
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleAddToWishlist(product.id, e)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                </button>
              </div>
              
              {/* Discount Badge */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="text-left">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{product.category}</span>
                {!product.inStock && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Out of Stock</span>
                )}
              </div>
              
              <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>
              )}
              
              {/* Vendor Info */}
              {product.vendor && (
                <p className="text-xs text-gray-500 mb-2">
                  by {product.vendor.name} • {product.vendor.location}
                </p>
              )}
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-600 font-bold text-lg">{formatPrice(product.price)}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</div>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(product.id, e)}
                  disabled={!product.inStock}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Products Button */}
      <div className="mt-12">
        <button 
          onClick={() => router.push('/products')}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          View All Products
        </button>
      </div>
    </section>
  );
}
