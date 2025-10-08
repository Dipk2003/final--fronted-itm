'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Category {
  id: number;
  name: string;
  description?: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  microCategories?: MicroCategory[];
}

interface MicroCategory {
  id: number;
  name: string;
  description?: string;
  subCategoryId: number;
}

interface Location {
  id: number;
  country: string;
  state: string;
  city: string;
  pincode: string;
  isActive: boolean;
}

interface ProductImage {
  id?: number;
  file?: File;
  url?: string;
  isPrimary: boolean;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountedPrice?: number;
  categoryId: number;
  subCategoryId: number;
  microCategoryId?: number;
  locationId: number;
  brand?: string;
  model?: string;
  specifications: { [key: string]: string };
  images: ProductImage[];
  tags: string[];
  isActive: boolean;
  inStock: boolean;
  stockQuantity?: number;
  minimumOrderQuantity: number;
  unitOfMeasurement: string;
}

export default function ProductListingFlow() {
  const [step, setStep] = useState(1); // 1: Category, 2: Location, 3: Details, 4: Images, 5: Review
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    categoryId: 0,
    subCategoryId: 0,
    locationId: 0,
    specifications: {},
    images: [],
    tags: [],
    isActive: true,
    inStock: true,
    minimumOrderQuantity: 1,
    unitOfMeasurement: 'piece'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [microCategories, setMicroCategories] = useState<MicroCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadStates();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.content) {
        setCategories(data.content);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSubCategories = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/subcategories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadMicroCategories = async (subCategoryId: number) => {
    try {
      const response = await fetch(`/api/admin/categories/subcategories/${subCategoryId}/microcategories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMicroCategories(data);
    } catch (error) {
      console.error('Error loading microcategories:', error);
    }
  };

  const loadStates = async () => {
    try {
      const response = await fetch('/api/data-entry/locations/states');
      const data = await response.json();
      if (data.success) {
        setStates(data.states);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadCities = async (state: string) => {
    try {
      const response = await fetch(`/api/data-entry/locations/cities?state=${encodeURIComponent(state)}`);
      const data = await response.json();
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const loadLocationsByCity = async (city: string) => {
    try {
      const response = await fetch(`/api/data-entry/locations?city=${encodeURIComponent(city)}&state=${encodeURIComponent(selectedState)}`);
      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    setProduct({ ...product, categoryId, subCategoryId: 0, microCategoryId: 0 });
    loadSubCategories(categoryId);
    setSubCategories([]);
    setMicroCategories([]);
  };

  const handleSubCategorySelect = (subCategoryId: number) => {
    setProduct({ ...product, subCategoryId, microCategoryId: 0 });
    loadMicroCategories(subCategoryId);
    setMicroCategories([]);
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setCities([]);
    setLocations([]);
    loadCities(state);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setLocations([]);
    loadLocationsByCity(city);
  };

  const handleImageUpload = (files: FileList) => {
    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: product.images.length === 0 && index === 0
    }));
    setProduct({ ...product, images: [...product.images, ...newImages] });
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmitProduct = async () => {
    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append product data
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('shortDescription', product.shortDescription);
      formData.append('price', product.price.toString());
      if (product.discountedPrice) formData.append('discountedPrice', product.discountedPrice.toString());
      formData.append('categoryId', product.categoryId.toString());
      formData.append('subCategoryId', product.subCategoryId.toString());
      if (product.microCategoryId) formData.append('microCategoryId', product.microCategoryId.toString());
      formData.append('locationId', product.locationId.toString());
      if (product.brand) formData.append('brand', product.brand);
      if (product.model) formData.append('model', product.model);
      formData.append('specifications', JSON.stringify(product.specifications));
      formData.append('tags', JSON.stringify(product.tags));
      formData.append('isActive', product.isActive.toString());
      formData.append('inStock', product.inStock.toString());
      if (product.stockQuantity) formData.append('stockQuantity', product.stockQuantity.toString());
      formData.append('minimumOrderQuantity', product.minimumOrderQuantity.toString());
      formData.append('unitOfMeasurement', product.unitOfMeasurement);

      // Append images
      product.images.forEach((image, index) => {
        if (image.file) {
          formData.append('images', image.file);
          formData.append(`isPrimary_${index}`, image.isPrimary.toString());
        }
      });

      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setStep(6); // Success step
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const CategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Product Category</h2>
        <p className="text-gray-600 mt-2">Choose the most appropriate category for your product</p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                product.categoryId === category.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {subCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subcategories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                onClick={() => handleSubCategorySelect(subCategory.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  product.subCategoryId === subCategory.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{subCategory.name}</h4>
                {subCategory.description && (
                  <p className="text-sm text-gray-600 mt-1">{subCategory.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Micro Categories */}
      {microCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Micro Categories (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {microCategories.map((microCategory) => (
              <button
                key={microCategory.id}
                onClick={() => setProduct({ ...product, microCategoryId: microCategory.id })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  product.microCategoryId === microCategory.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{microCategory.name}</h4>
                {microCategory.description && (
                  <p className="text-sm text-gray-600 mt-1">{microCategory.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!product.categoryId || !product.subCategoryId}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Next: Location
        </button>
      </div>
    </div>
  );

  const LocationSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Location</h2>
        <p className="text-gray-600 mt-2">Choose where your product is available</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              disabled={!selectedState}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode Area</label>
            <select
              value={product.locationId}
              onChange={(e) => setProduct({ ...product, locationId: parseInt(e.target.value) })}
              disabled={!selectedCity}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Area</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.pincode} - {location.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Location Display */}
        {product.locationId > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Location:</h4>
            <p className="text-blue-700">
              {locations.find(l => l.id === product.locationId)?.city}, {selectedState} - {locations.find(l => l.id === product.locationId)?.pincode}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back: Category
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!product.locationId}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Next: Product Details
        </button>
      </div>
    </div>
  );

  const ProductDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
        <p className="text-gray-600 mt-2">Provide comprehensive product information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <input
                type="text"
                value={product.shortDescription}
                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                placeholder="Brief product description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
              <textarea
                rows={4}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Detailed product description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (₹)</label>
                <input
                  type="number"
                  value={product.discountedPrice || ''}
                  onChange={(e) => setProduct({ ...product, discountedPrice: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={product.brand || ''}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                  placeholder="Brand name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  value={product.model || ''}
                  onChange={(e) => setProduct({ ...product, model: e.target.value })}
                  placeholder="Model number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Qty</label>
                <input
                  type="number"
                  value={product.minimumOrderQuantity}
                  onChange={(e) => setProduct({ ...product, minimumOrderQuantity: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={product.unitOfMeasurement}
                  onChange={(e) => setProduct({ ...product, unitOfMeasurement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram</option>
                  <option value="liter">Liter</option>
                  <option value="meter">Meter</option>
                  <option value="box">Box</option>
                  <option value="set">Set</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.inStock}
                  onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back: Location
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!product.name || !product.description || !product.price}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Next: Images
        </button>
      </div>
    </div>
  );

  const ImageUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
        <p className="text-gray-600 mt-2">Upload high-quality images of your product</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Click to upload images</p>
            <p className="text-sm text-gray-500">or drag and drop files here</p>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB each</p>
          </label>
        </div>

        {/* Image Preview */}
        {product.images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Uploaded Images ({product.images.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back: Details
        </button>
        <button
          onClick={() => setStep(5)}
          disabled={product.images.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Next: Review
        </button>
      </div>
    </div>
  );

  const ProductReview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Product</h2>
        <p className="text-gray-600 mt-2">Check all details before publishing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
            <div className="space-y-2">
              <div><strong>Name:</strong> {product.name}</div>
              <div><strong>Description:</strong> {product.shortDescription}</div>
              <div><strong>Price:</strong> ₹{product.price}</div>
              {product.discountedPrice && (
                <div><strong>Discounted Price:</strong> ₹{product.discountedPrice}</div>
              )}
              <div><strong>Brand:</strong> {product.brand || 'Not specified'}</div>
              <div><strong>Model:</strong> {product.model || 'Not specified'}</div>
              <div><strong>Min Order:</strong> {product.minimumOrderQuantity} {product.unitOfMeasurement}</div>
            </div>
          </div>

          {/* Category & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Category & Location</h3>
            <div className="space-y-2">
              <div><strong>Category:</strong> {categories.find(c => c.id === product.categoryId)?.name}</div>
              <div><strong>Subcategory:</strong> {subCategories.find(s => s.id === product.subCategoryId)?.name}</div>
              {product.microCategoryId && (
                <div><strong>Micro Category:</strong> {microCategories.find(m => m.id === product.microCategoryId)?.name}</div>
              )}
              <div><strong>Location:</strong> {selectedCity}, {selectedState}</div>
              <div><strong>Pincode:</strong> {locations.find(l => l.id === product.locationId)?.pincode}</div>
            </div>
          </div>
        </div>

        {/* Images Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                {image.isPrimary && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
            {product.images.length > 4 && (
              <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
                +{product.images.length - 4} more
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(4)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back: Images
        </button>
        <button
          onClick={handleSubmitProduct}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </div>
    </div>
  );

  const SuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Product Published!</h2>
        <p className="text-gray-600 mt-2">Your product has been successfully added to the marketplace</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.shortDescription}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/vendor-panel'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              setStep(1);
              setProduct({
                name: '',
                description: '',
                shortDescription: '',
                price: 0,
                categoryId: 0,
                subCategoryId: 0,
                locationId: 0,
                specifications: {},
                images: [],
                tags: [],
                isActive: true,
                inStock: true,
                minimumOrderQuantity: 1,
                unitOfMeasurement: 'piece'
              });
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Add Another Product
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return <CategorySelection />;
      case 2: return <LocationSelection />;
      case 3: return <ProductDetails />;
      case 4: return <ImageUpload />;
      case 5: return <ProductReview />;
      case 6: return <SuccessStep />;
      default: return <CategorySelection />;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        {step < 6 && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 5 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2 max-w-md mx-auto">
              <span>Category</span>
              <span>Location</span>
              <span>Details</span>
              <span>Images</span>
              <span>Review</span>
            </div>
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
}