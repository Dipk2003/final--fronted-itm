import React from 'react';
import { Search, Filter, ShoppingCart, Star, MapPin, Truck, Shield, Eye, Heart } from 'lucide-react';

const ProductsYouBuyPage = () => {
  const products = [
    {
      id: 1,
      name: "Industrial Steel Pipes",
      category: "Steel & Metal",
      description: "High-quality industrial grade steel pipes for construction and manufacturing",
      price: "₹85/kg",
      minOrder: "500 kg",
      supplier: "MetalCorp Industries",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      reviews: 245,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["IS 3589 Certified", "Multiple Sizes", "Bulk Orders", "Fast Delivery"],
      inStock: true
    },
    {
      id: 2,
      name: "Organic Cotton Fabric",
      category: "Textiles",
      description: "Premium organic cotton fabric for garment manufacturing",
      price: "₹180/meter",
      minOrder: "1000 meters",
      supplier: "EcoTextiles Ltd",
      location: "Bangalore, Karnataka",
      rating: 4.9,
      reviews: 189,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["GOTS Certified", "Sustainable", "Various Colors", "Premium Quality"],
      inStock: true
    },
    {
      id: 3,
      name: "LED Components Kit",
      category: "Electronics",
      description: "Complete LED components kit for lighting manufacturers",
      price: "₹45/piece",
      minOrder: "5000 pieces",
      supplier: "TechLED Solutions",
      location: "Pune, Maharashtra",
      rating: 4.7,
      reviews: 156,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["High Efficiency", "Long Lifespan", "Multiple Variants", "Technical Support"],
      inStock: true
    },
    {
      id: 4,
      name: "Food Grade Packaging",
      category: "Packaging",
      description: "FDA approved food grade packaging materials",
      price: "₹12/unit",
      minOrder: "10000 units",
      supplier: "SafePack Industries",
      location: "Delhi, NCR",
      rating: 4.6,
      reviews: 298,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["FDA Approved", "Eco-Friendly", "Custom Sizes", "Bulk Pricing"],
      inStock: true
    },
    {
      id: 5,
      name: "Pharmaceutical Raw Materials",
      category: "Pharmaceuticals",
      description: "High purity pharmaceutical raw materials and APIs",
      price: "₹2,500/kg",
      minOrder: "25 kg",
      supplier: "PharmaChem Corp",
      location: "Hyderabad, Telangana",
      rating: 4.9,
      reviews: 134,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["WHO GMP", "COA Provided", "High Purity", "Regulatory Compliance"],
      inStock: true
    },
    {
      id: 6,
      name: "Solar Panel Components",
      category: "Solar Equipment",
      description: "Complete solar panel components for renewable energy projects",
      price: "₹25/watt",
      minOrder: "1000 watts",
      supplier: "SolarTech Energy",
      location: "Jaipur, Rajasthan",
      rating: 4.8,
      reviews: 167,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["High Efficiency", "25 Year Warranty", "Certified", "Installation Support"],
      inStock: true
    },
    {
      id: 7,
      name: "Industrial Machinery Parts",
      category: "Machinery",
      description: "Precision engineered industrial machinery parts and components",
      price: "₹1,200/piece",
      minOrder: "100 pieces",
      supplier: "MechParts Industries",
      location: "Chennai, Tamil Nadu",
      rating: 4.7,
      reviews: 203,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["Precision Made", "Durable", "Custom Orders", "Technical Support"],
      inStock: false
    },
    {
      id: 8,
      name: "Chemical Compounds",
      category: "Chemicals",
      description: "Industrial grade chemical compounds for manufacturing",
      price: "₹350/kg",
      minOrder: "500 kg",
      supplier: "ChemCore Solutions",
      location: "Vadodara, Gujarat",
      rating: 4.5,
      reviews: 178,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["High Purity", "Safety Certified", "Bulk Supply", "Technical Data"],
      inStock: true
    },
    {
      id: 9,
      name: "Agricultural Equipment",
      category: "Agriculture",
      description: "Modern agricultural equipment and farming tools",
      price: "₹15,000/unit",
      minOrder: "10 units",
      supplier: "AgriTech Solutions",
      location: "Ludhiana, Punjab",
      rating: 4.6,
      reviews: 89,
      image: "/api/placeholder/300/200",
      verified: true,
      features: ["Modern Design", "Efficient", "Warranty", "Training Support"],
      inStock: true
    }
  ];

  const categories = [
    { name: "All Categories", count: 1250 },
    { name: "Steel & Metal", count: 180 },
    { name: "Textiles", count: 320 },
    { name: "Electronics", count: 295 },
    { name: "Packaging", count: 140 },
    { name: "Pharmaceuticals", count: 85 },
    { name: "Solar Equipment", count: 70 },
    { name: "Machinery", count: 110 },
    { name: "Chemicals", count: 95 },
    { name: "Agriculture", count: 65 }
  ];

  const filters = {
    priceRange: ["Under ₹100", "₹100 - ₹500", "₹500 - ₹1,000", "₹1,000 - ₹5,000", "Above ₹5,000"],
    location: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Ahmedabad"],
    availability: ["In Stock", "Out of Stock", "Pre-Order"],
    rating: ["4+ Stars", "3+ Stars", "2+ Stars", "1+ Stars"]
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Products You Buy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover quality products from verified suppliers across India for your business needs
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, suppliers, categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Categories</option>
              {categories.slice(1).map((category, index) => (
                <option key={index} value={category.name}>{category.name}</option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Locations</option>
              {filters.location.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Filter className="mr-2" size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Products</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2 text-blue-600" />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {filters.priceRange.map((range, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  {filters.availability.map((status, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {filters.rating.map((rating, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {products.length} products
              </div>
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <ShoppingCart size={32} className="mx-auto mb-2" />
                        <div className="text-sm font-medium">{product.category}</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                    </div>
                    {!product.inStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{product.category}</span>
                      {product.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="text-yellow-500 mr-1" size={14} />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="mr-1" size={14} />
                      <span>{product.location}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">{product.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min Order:</span>
                        <span className="font-medium">{product.minOrder}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{product.features.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          product.inStock 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <nav className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
              </nav>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ProductsYouBuyPage;
