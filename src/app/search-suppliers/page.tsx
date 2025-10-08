import React from 'react';
import { Navbar, Footer } from '@/shared/components';
import { Search, Filter, MapPin, Star, Building, Users, Package, Phone, Mail, Globe, CheckCircle, Award } from 'lucide-react';

const SearchSuppliersPage = () => {
  const suppliers = [
    {
      id: 1,
      name: "MetalCorp Industries",
      businessType: "Manufacturer",
      category: "Steel & Metal",
      location: "Mumbai, Maharashtra",
      yearEstablished: 2010,
      employees: "201-500",
      rating: 4.8,
      reviews: 245,
      totalProducts: 156,
      verified: true,
      goldMember: true,
      description: "Leading manufacturer of industrial steel pipes and metal components with ISO certification",
      specialties: ["Steel Pipes", "Metal Sheets", "Industrial Components", "Custom Manufacturing"],
      certifications: ["ISO 9001:2015", "CE Certified", "ISI Marked"],
      responseTime: "2 hours",
      responseRate: "95%",
      contactPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "info@metalcorp.com",
      website: "www.metalcorp.com",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "EcoTextiles Limited",
      businessType: "Manufacturer & Exporter",
      category: "Textiles",
      location: "Bangalore, Karnataka",
      yearEstablished: 2015,
      employees: "101-200",
      rating: 4.9,
      reviews: 189,
      totalProducts: 89,
      verified: true,
      goldMember: true,
      description: "Sustainable textile manufacturer specializing in organic cotton and eco-friendly fabrics",
      specialties: ["Organic Cotton", "Sustainable Fabrics", "Garment Manufacturing", "Export Services"],
      certifications: ["GOTS Certified", "OEKO-TEX Standard", "Fair Trade"],
      responseTime: "1 hour",
      responseRate: "98%",
      contactPerson: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "contact@ecotextiles.com",
      website: "www.ecotextiles.com",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "TechLED Solutions",
      businessType: "Manufacturer",
      category: "Electronics",
      location: "Pune, Maharashtra",
      yearEstablished: 2012,
      employees: "51-100",
      rating: 4.7,
      reviews: 156,
      totalProducts: 203,
      verified: true,
      goldMember: false,
      description: "Innovative LED components manufacturer with focus on energy-efficient lighting solutions",
      specialties: ["LED Components", "Lighting Solutions", "Circuit Boards", "Electronic Assembly"],
      certifications: ["RoHS Compliant", "CE Marked", "FCC Certified"],
      responseTime: "3 hours",
      responseRate: "92%",
      contactPerson: "Amit Patel",
      phone: "+91 76543 21098",
      email: "sales@techled.com",
      website: "www.techled.com",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "SafePack Industries",
      businessType: "Manufacturer",
      category: "Packaging",
      location: "Delhi, NCR",
      yearEstablished: 2008,
      employees: "101-200",
      rating: 4.6,
      reviews: 298,
      totalProducts: 134,
      verified: true,
      goldMember: true,
      description: "Premium packaging solutions provider for food and pharmaceutical industries",
      specialties: ["Food Packaging", "Pharmaceutical Packaging", "Custom Solutions", "Eco-Friendly Options"],
      certifications: ["FDA Approved", "BRC Certified", "HACCP Compliant"],
      responseTime: "2 hours",
      responseRate: "94%",
      contactPerson: "Neha Gupta",
      phone: "+91 65432 10987",
      email: "info@safepack.com",
      website: "www.safepack.com",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      name: "PharmaChem Corporation",
      businessType: "Manufacturer & Supplier",
      category: "Pharmaceuticals",
      location: "Hyderabad, Telangana",
      yearEstablished: 2005,
      employees: "201-500",
      rating: 4.9,
      reviews: 134,
      totalProducts: 67,
      verified: true,
      goldMember: true,
      description: "Leading pharmaceutical raw materials supplier with WHO GMP certification",
      specialties: ["API Manufacturing", "Raw Materials", "Pharmaceutical Intermediates", "Quality Control"],
      certifications: ["WHO GMP", "US FDA", "EU GMP", "ISO 14001"],
      responseTime: "1 hour",
      responseRate: "99%",
      contactPerson: "Dr. Suresh Modi",
      phone: "+91 54321 09876",
      email: "contact@pharmachem.com",
      website: "www.pharmachem.com",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      name: "SolarTech Energy",
      businessType: "Manufacturer & Installer",
      category: "Solar Equipment",
      location: "Jaipur, Rajasthan",
      yearEstablished: 2014,
      employees: "51-100",
      rating: 4.8,
      reviews: 167,
      totalProducts: 89,
      verified: true,
      goldMember: false,
      description: "Solar energy solutions provider with complete installation and maintenance services",
      specialties: ["Solar Panels", "Inverters", "Installation", "Maintenance Services"],
      certifications: ["IEC Certified", "MNRE Approved", "ISO 9001"],
      responseTime: "4 hours",
      responseRate: "90%",
      contactPerson: "Ravi Krishnan",
      phone: "+91 43210 98765",
      email: "info@solartech.com",
      website: "www.solartech.com",
      image: "/api/placeholder/300/200"
    }
  ];

  const categories = [
    { name: "All Categories", count: 850 },
    { name: "Steel & Metal", count: 120 },
    { name: "Textiles", count: 180 },
    { name: "Electronics", count: 145 },
    { name: "Packaging", count: 95 },
    { name: "Pharmaceuticals", count: 65 },
    { name: "Solar Equipment", count: 45 },
    { name: "Machinery", count: 78 },
    { name: "Chemicals", count: 58 },
    { name: "Agriculture", count: 42 }
  ];

  const businessTypes = ["All Types", "Manufacturer", "Supplier", "Exporter", "Importer", "Trader", "Service Provider"];
  const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Ahmedabad", "Kolkata"];
  const employeeRanges = ["All Sizes", "1-10", "11-50", "51-100", "101-200", "201-500", "500+"];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Suppliers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find verified suppliers and manufacturers across India for your business requirements
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search suppliers, companies, products..."
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
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Filter className="mr-2" size={16} />
              Filter
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {businessTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {employeeRanges.map((range, index) => (
                <option key={index} value={range}>{range}</option>
              ))}
            </select>
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2 text-blue-600" />
              Verified Suppliers Only
            </label>
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2 text-blue-600" />
              Gold Members Only
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">850+</div>
            <div className="text-sm text-gray-600">Total Suppliers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">650+</div>
            <div className="text-sm text-gray-600">Verified Suppliers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">200+</div>
            <div className="text-sm text-gray-600">Gold Members</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">95%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refine Search</h3>
              
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

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {["4+ Stars", "3+ Stars", "2+ Stars", "1+ Stars"].map((rating, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years in Business */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Years in Business</h4>
                <div className="space-y-2">
                  {["20+ Years", "15-20 Years", "10-15 Years", "5-10 Years", "Under 5 Years"].map((years, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{years}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Suppliers List */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {suppliers.length} suppliers
              </div>
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Sort by: Relevance</option>
                  <option>Rating: High to Low</option>
                  <option>Response Time: Fast to Slow</option>
                  <option>Years in Business</option>
                  <option>Location: A to Z</option>
                </select>
              </div>
            </div>

            {/* Suppliers Grid */}
            <div className="space-y-6">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Supplier Image */}
                    <div className="lg:w-1/4">
                      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Building size={32} className="mx-auto mb-2" />
                          <div className="text-sm font-medium">{supplier.category}</div>
                        </div>
                      </div>
                    </div>

                    {/* Supplier Details */}
                    <div className="lg:w-3/4">
                      <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 mr-3">{supplier.name}</h3>
                            <div className="flex items-center gap-2">
                              {supplier.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                  <CheckCircle size={12} className="mr-1" />
                                  Verified
                                </span>
                              )}
                              {supplier.goldMember && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Award size={12} className="mr-1" />
                                  Gold
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{supplier.description}</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Building className="mr-2" size={14} />
                              <span>{supplier.businessType}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-2" size={14} />
                              <span>{supplier.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-2" size={14} />
                              <span>{supplier.employees} employees</span>
                            </div>
                            <div className="flex items-center">
                              <Package className="mr-2" size={14} />
                              <span>{supplier.totalProducts} products</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-2">
                            <Star className="text-yellow-500 mr-1" size={16} />
                            <span className="font-medium">{supplier.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({supplier.reviews})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Est. {supplier.yearEstablished}
                          </div>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {supplier.specialties.map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Certifications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {supplier.certifications.map((cert, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact and Response Info */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 lg:mb-0">
                          <span>Response Time: <strong>{supplier.responseTime}</strong></span>
                          <span>Response Rate: <strong>{supplier.responseRate}</strong></span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm">
                            <Mail className="mr-2" size={16} />
                            Send Inquiry
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm">
                            <Phone className="mr-2" size={16} />
                            Call Now
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm">
                            <Globe className="mr-2" size={16} />
                            Visit
                          </button>
                        </div>
                      </div>
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

export default SearchSuppliersPage;
