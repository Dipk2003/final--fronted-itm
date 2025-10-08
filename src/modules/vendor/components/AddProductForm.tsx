'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { productAPI, ProductDto } from '@/shared/services/productApi';
import { categoryAPI, Category } from '@/shared/services/categoryApi';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components';
import { PlusCircle, Upload, X, AlertCircle } from 'lucide-react';
import { MOCK_MODE } from '@/lib/mockMode';

interface AddProductFormProps {
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<Omit<ProductDto, 'id' | 'images' | 'vendorId' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    categoryId: 0,
    brand: '',
    model: '',
    sku: '',
    minOrderQuantity: 1,
    unit: 'piece',
    specifications: '',
    tags: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    freeShipping: false,
    shippingCharge: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryAPI.getAllCategories();
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      
      // Provide fallback categories when API fails
      const fallbackCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Computer Accessories' },
        { id: 3, name: 'Mobile Accessories' },
        { id: 4, name: 'Office Supplies' },
        { id: 5, name: 'Hardware & Tools' },
        { id: 6, name: 'Networking Equipment' },
        { id: 7, name: 'Audio & Video' },
        { id: 8, name: 'Storage Devices' }
      ];
      
      setCategories(fallbackCategories);
      
      if (error.response?.status === 403) {
        console.warn('Access forbidden to categories API. Using fallback categories.');
      } else if (error.response?.status === 401) {
        console.warn('User not authenticated. Using fallback categories.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              name === 'categoryId' ? parseInt(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Please select only JPEG, PNG, or WebP images');
      return;
    }

    // Limit to 5 images
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (formData.categoryId === 0) newErrors.categoryId = 'Please select a category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log('🚀 Starting product submission...');
    console.log('Form data:', formData);
    console.log('User:', user);
    console.log('Token available:', !!localStorage.getItem('token'));
    
    setLoading(true);
    try {
      // Add product
      console.log('📦 Calling productAPI.addProduct...');
      const product = await productAPI.addProduct(formData);
      console.log('✅ Product added successfully:', product);
      
      // Upload images if any
      if (selectedImages.length > 0) {
        await productAPI.uploadProductImages(product.id, selectedImages);
      }

      // Show success message
      alert('Product added successfully!');
      onSuccess?.(product);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        categoryId: 0,
        brand: '',
        model: '',
        sku: '',
        minOrderQuantity: 1,
        unit: 'piece',
        specifications: '',
        tags: '',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        freeShipping: false,
        shippingCharge: 0,
        isActive: true,
      });
      setSelectedImages([]);
      setPreviewUrls([]);
      
    } catch (error: any) {
      console.error('Error adding product:', error);
      
      let errorMessage = 'Error adding product';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = `Bad Request: ${data?.message || 'Invalid product data'}`;
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in first';
            break;
          case 403:
            errorMessage = 'Forbidden: You don\'t have permission to add products';
            break;
          case 404:
            errorMessage = 'Not Found: Product API endpoint not found';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            break;
          default:
            errorMessage = data?.message || `Error ${status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Network error - no response received
        errorMessage = 'Network Error: Unable to connect to server. Please check if the backend is running on port 8080.';
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  const unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'gram', label: 'Gram' },
    { value: 'liter', label: 'Liter' },
    { value: 'meter', label: 'Meter' },
    { value: 'pair', label: 'Pair' },
    { value: 'set', label: 'Set' },
    { value: 'box', label: 'Box' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Development Notice */}
      {MOCK_MODE && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Development Mode</p>
            <p className="text-sm text-yellow-700">
              Backend server not detected. Using mock data for development.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter product name"
          />
          
          <Select
            label="Category *"
            name="categoryId"
            value={formData.categoryId.toString()}
            onChange={handleInputChange}
            options={categoryOptions}
            error={errors.categoryId}
            placeholder="Select category"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
          />
          
          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Enter model"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="Enter SKU"
          />
          
          <Input
            label="Price (₹) *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <Input
            label="Original Price (₹)"
            name="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Stock Quantity *"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            error={errors.stock}
            placeholder="0"
            min="0"
          />
          
          <Input
            label="Min Order Quantity"
            name="minOrderQuantity"
            type="number"
            value={formData.minOrderQuantity}
            onChange={handleInputChange}
            placeholder="1"
            min="1"
          />
          
          <Select
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={unitOptions}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specifications
          </label>
          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product specifications"
          />
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="Enter tags separated by commas"
        />

        {/* Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <Input
            label="Length (cm)"
            name="length"
            type="number"
            value={formData.length}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <Input
            label="Width (cm)"
            name="width"
            type="number"
            value={formData.width}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <Input
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freeShipping"
              name="freeShipping"
              checked={formData.freeShipping}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="freeShipping" className="text-sm text-gray-700">
              Free Shipping
            </label>
          </div>
          
          {!formData.freeShipping && (
            <Input
              label="Shipping Charge (₹)"
              name="shippingCharge"
              type="number"
              value={formData.shippingCharge}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          )}
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Upload images
                  </span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, WebP up to 5 images
              </p>
            </div>
          </div>
          
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
