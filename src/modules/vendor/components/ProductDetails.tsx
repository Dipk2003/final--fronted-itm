'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { 
  MapPinIcon, 
  PhoneIcon, 
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components';
import { Card, CardContent, CardHeader } from '@/shared/components/Card';


// Types
interface Product {
  id: string;
  name: string;
  price: string;
  img_src: string;
  desc: string;
  company: string;
  rating: string;
  discount?: string;
  delear_name?: string;
}

interface OrderForm {
  user_name: string;
  user_email: string;
  qty: string;
  date: string;
  message: string;
}

// Use backend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Email.js Configuration - should be in environment variables
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    user_name: '',
    user_email: '',
    qty: '',
    date: '',
    message: ''
  });

  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  // Determine product type from ID
  const getProductType = (id: string): string => {
    if (id.startsWith('m')) return 'medicines';
    if (id.startsWith('p')) return 'projector';
    if (id.startsWith('s')) return 'solarpanel';
    return 'medicines'; // default
  };

  // Fetch product details from backend API
  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products from backend API
  const fetchRelatedProducts = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/related/${id}?limit=4`);
      setRelatedProducts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    
    setOrderForm(prev => ({
      ...prev,
      [name]: value,
      date: formattedDate
    }));
  };

  // Handle simple order action
  const handleOrderClick = () => {
    alert('Order functionality will be implemented');
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchRelatedProducts(productId);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* Product Image */}
            <div className="md:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative h-80 w-full">
                  <Image
                    src={product.img_src}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-blue-600 mb-6">
                  {product.price}
                  <span className="text-lg font-normal text-gray-600">/Pack</span>
                </p>

                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <span className="font-semibold">Name:</span> {product.name}
                  </div>
                  <div className="border-b pb-2">
                    <span className="font-semibold">Description:</span> {product.desc}
                  </div>
                  <div className="border-b pb-2">
                    <span className="font-semibold">Company:</span> {product.company}
                  </div>
                  <div className="border-b pb-2">
                    <span className="font-semibold">Rating:</span> {product.rating}
                  </div>
                </div>

                <p className="mt-6 text-gray-700 font-medium">
                  We offers Bronchodilator & Expectorant {product.name}.
                </p>

                <div className="flex space-x-3 mt-6">
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleOrderClick}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    ♥ Add to Wishlist
                  </Button>
                </div>
              </div>
            </div>

            {/* Retailer Details */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-center">
                    {product.delear_name || 'Dwarkesh Pharmaceuticals'}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src="https://3.imimg.com/data3/GR/HK/MY-2474176/dwarkesh-pharmaceuticals-pvt-ltd-90x90.png"
                      alt="Dealer"
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          GIDC Vatwa, Ahmedabad, Gujarat
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-600">
                          GST- 24AAACD6674N1ZA
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Call</span>
                    <span className="text-sm font-medium">+91 7290000423</span>
                  </div>

                  <p className="text-sm text-gray-600">64% Response Rate</p>

                  <Button variant="outline" className="w-full text-teal-600 border-teal-600 hover:bg-teal-50">
                    Contact Supplier
                  </Button>

                  <hr />

                  <Link href="#" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                    View More Sellers {'>'}
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
              <p className="text-gray-600">Reviews feature coming soon...</p>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 underline">
              Browse Related Categories
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src={relatedProduct.img_src}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    
                    <Badge className="mb-2 bg-teal-100 text-teal-800">New</Badge>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    
                    <p className="text-lg font-bold text-gray-900 mb-4">
                      Price: ₹ {relatedProduct.price}
                      <span className="text-sm font-normal text-gray-600"> / Piece</span>
                    </p>
                    
                    <Link href={`/productdetails/${relatedProduct.id}`}>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        See more details...
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Dialog */}
      {isOrderDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Place Your Order</h2>
                <button 
                  onClick={() => setIsOrderDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="relative h-40 w-full mb-4">
                    <Image
                      src={product.img_src}
                      alt={product.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {product.name}</p>
                    <p><span className="font-semibold">Price:</span> {product.price}</p>
                    <p><span className="font-semibold">Rating:</span> {product.rating}</p>
                    {product.discount && (
                      <p><span className="font-semibold">Discount:</span> {product.discount}</p>
                    )}
                  </div>
                </div>

                {/* Simple Contact Form */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact for Inquiry</h3>
                  <p className="text-gray-600">Inquiry form will be implemented here</p>
                  <Button 
                    onClick={() => setIsOrderDialogOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Dealer will contact you within 3 days
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductDetails;
