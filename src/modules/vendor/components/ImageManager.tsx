'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { productAPI, Product } from '@/shared/services/productApi';
import { Button } from '@/shared/components/Button';
import { Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ImageManagerProps {
  product: Product;
  onClose?: () => void;
  onImageUpdate?: (product: Product) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ product, onClose, onImageUpdate }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  // Helper function to convert relative URLs to absolute URLs
  const getAbsoluteImageUrl = (url: string): string => {
    if (!url) return url;
    
    // If it's already an absolute URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL starting with /, prepend backend URL
    if (url.startsWith('/')) {
      return `http://localhost:8080${url}`;
    }
    
    // If it's a relative URL without /, prepend backend URL with /
    return `http://localhost:8080/${url}`;
  };

  // Initialize current images
  React.useEffect(() => {
    const urls: string[] = [];
    
    console.log('🖼️ Initializing images for product:', product);
    console.log('🔍 Product data structure:', {
      id: product.id,
      name: product.name,
      images: product.images,
      imageUrls: product.imageUrls,
      hasImages: product.images?.length || 0,
      hasImageUrls: product.imageUrls?.length || 0,
      rawProduct: JSON.stringify(product, null, 2)
    });
    
    // Debug all product properties that might contain image data
    Object.keys(product).forEach(key => {
      if (key.toLowerCase().includes('image') || key.toLowerCase().includes('url')) {
        console.log(`🔍 Found image-related property: ${key} =`, product[key]);
      }
    });
    
    // Get from images array
    if (product.images && product.images.length > 0) {
      console.log('📸 Found images array:', product.images);
      const imageUrls = product.images.map(img => {
        const absoluteUrl = getAbsoluteImageUrl(img.imageUrl);
        console.log(`🔄 Converting: ${img.imageUrl} -> ${absoluteUrl}`);
        return absoluteUrl;
      });
      urls.push(...imageUrls);
    }
    
    // Get from imageUrls string
    if (product.imageUrls && product.imageUrls.trim()) {
      console.log('🔗 Found imageUrls string:', product.imageUrls);
      const stringUrls = product.imageUrls.split(',').filter(url => url.trim()).map(url => {
        const trimmed = url.trim();
        const absoluteUrl = getAbsoluteImageUrl(trimmed);
        console.log(`🔄 Converting string URL: ${trimmed} -> ${absoluteUrl}`);
        return absoluteUrl;
      });
      urls.push(...stringUrls);
    }
    
    console.log('🖼️ Final image URLs (converted to absolute):', urls);
    console.log('📊 Image count:', urls.length);
    setCurrentImages([...new Set(urls)]);
    
    // Test if backend is accessible
    if (urls.length === 0) {
      console.log('⚠️ No images found for product. Testing backend connectivity...');
      fetch('http://localhost:8080/health')
        .then(response => {
          console.log('🟢 Backend health check:', response.status === 200 ? 'OK' : 'FAILED');
        })
        .catch(error => {
          console.log('❌ Backend not accessible:', error.message);
        });
    }
  }, [product]);

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
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(files);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const removePreview = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleAddImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images to upload');
      return;
    }

    setLoading(true);
    try {
      console.log('🖼️ Adding images to product:', product.id);
      const uploadedUrls = await productAPI.uploadProductImages(product.id, selectedImages);
      console.log('✅ Images added successfully:', uploadedUrls);
      
      // Convert uploaded URLs to absolute URLs
      const absoluteUploadedUrls = uploadedUrls.map(url => getAbsoluteImageUrl(url));
      console.log('🔄 Converted to absolute URLs:', absoluteUploadedUrls);
      
      // Update current images list
      setCurrentImages(prev => {
        const newImages = [...prev, ...absoluteUploadedUrls];
        console.log('📸 Updated current images:', newImages);
        return newImages;
      });
      
      // Clear selection
      setSelectedImages([]);
      setPreviewUrls([]);
      
      // Refresh product data from server to ensure we have the latest image data
      try {
        const refreshedProduct = await productAPI.getProductById(product.id);
        console.log('🔄 Refreshed product data:', refreshedProduct);
        
        // Notify parent component with refreshed data
        if (onImageUpdate) {
          onImageUpdate(refreshedProduct);
        }
      } catch (refreshError) {
        console.warn('⚠️ Could not refresh product data, using local update:', refreshError);
        
        // Fallback: use local update
        if (onImageUpdate) {
          const updatedProduct = {
            ...product,
            imageUrls: [...currentImages, ...absoluteUploadedUrls].join(',')
          };
          onImageUpdate(updatedProduct);
        }
      }
      
      alert(`${uploadedUrls.length} images added successfully!`);
    } catch (error: any) {
      console.error('❌ Error adding images:', error);
      alert('Failed to add images: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images to upload');
      return;
    }

    const confirmReplace = confirm(`This will replace all existing images with ${selectedImages.length} new images. Continue?`);
    if (!confirmReplace) return;

    setLoading(true);
    try {
      console.log('🔄 Replacing images for product:', product.id);
      const newUrls = await productAPI.updateProductImages(product.id, selectedImages);
      console.log('✅ Images replaced successfully:', newUrls);
      
      // Convert new URLs to absolute URLs
      const absoluteNewUrls = newUrls.map(url => getAbsoluteImageUrl(url));
      
      // Update current images list
      setCurrentImages(absoluteNewUrls);
      
      // Clear selection
      setSelectedImages([]);
      setPreviewUrls([]);
      
      // Notify parent component
      if (onImageUpdate) {
        const updatedProduct = {
          ...product,
          imageUrls: absoluteNewUrls.join(',')
        };
        onImageUpdate(updatedProduct);
      }
      
      alert(`Images replaced successfully! Now showing ${newUrls.length} images.`);
    } catch (error: any) {
      console.error('❌ Error replacing images:', error);
      alert('Failed to replace images: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Product Images</h2>
            <p className="text-gray-600">{product.name}</p>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Current Images */}
          {currentImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Images ({currentImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentImages.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Product image ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded-md border-2 border-gray-200"
                      onError={() => {
                        console.log('❌ Image failed to load:', url);
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentImages.length === 0 && (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">This product doesn't have any images yet.</p>
            </div>
          )}

          {/* Image Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentImages.length > 0 ? 'Add or Replace Images' : 'Upload Images'}
            </h3>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Select images
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

            {/* Preview Selected Images */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Selected Images ({selectedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-24 object-cover rounded-md border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1">
                        <span className="bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                          {selectedImages[index]?.name?.substring(0, 10)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            
            {selectedImages.length > 0 && (
              <>
                <Button
                  onClick={handleAddImages}
                  loading={loading}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
                
                {currentImages.length > 0 && (
                  <Button
                    onClick={handleReplaceImages}
                    loading={loading}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Replace All Images
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;
