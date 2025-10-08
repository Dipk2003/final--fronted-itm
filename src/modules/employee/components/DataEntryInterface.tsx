'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Location {
  id?: number;
  country: string;
  state: string;
  city: string;
  pincode: string;
  isActive: boolean;
}

interface Category {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  categoryId: number;
  microCategories?: MicroCategory[];
}

interface MicroCategory {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  subCategoryId: number;
}

export default function DataEntryInterface() {
  const [activeTab, setActiveTab] = useState('locations');
  const [isMobile, setIsMobile] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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
    if (activeTab === 'locations') {
      loadLocations();
    } else if (activeTab === 'categories') {
      loadCategories();
    }
  }, [activeTab]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data-entry/locations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (locationData: Location) => {
    try {
      const response = await fetch('/api/data-entry/locations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });
      const data = await response.json();
      if (data.success) {
        setLocations([...locations, data.location]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleAddCategory = async (categoryData: Category) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      if (data) {
        setCategories([...categories, data]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const tabs = [
    { id: 'locations', label: 'Locations', icon: '📍' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'analytics', label: 'My Stats', icon: '📊' }
  ];

  const LocationManager = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Management</h2>
          <p className="text-gray-600">Manage cities, states, and pincodes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Location
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All States</option>
              {[...new Set(locations.map(l => l.state))].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadLocations}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations
                .filter(location => 
                  location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  location.pincode.includes(searchTerm)
                )
                .filter(location => selectedState === '' || location.state === selectedState)
                .map((location, index) => (
                <tr key={location.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.pincode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      location.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingItem(location)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CategoryManager = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600">Manage product categories hierarchy</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Add Category
        </button>
      </div>

      {/* Category Tree */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{category.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => setEditingItem(category)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
            
            {/* Subcategories would be displayed here */}
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-500">Subcategories: Coming soon...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Work Statistics</h2>
        <p className="text-gray-600">Track your data entry contributions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Locations Added</p>
              <p className="text-2xl font-bold">{locations.length}</p>
            </div>
            <div className="text-3xl opacity-80">📍</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Categories Added</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="text-3xl opacity-80">📂</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">This Month</p>
              <p className="text-2xl font-bold">+12</p>
            </div>
            <div className="text-3xl opacity-80">📈</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'locations':
        return <LocationManager />;
      case 'categories':
        return <CategoryManager />;
      case 'analytics':
        return <AnalyticsPanel />;
      default:
        return <LocationManager />;
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`/api/data-entry/locations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setLocations(locations.filter(l => l.id !== id));
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                E
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Data Entry</h1>
                <p className="text-xs text-gray-500">Hi, {user?.name || 'Employee'}</p>
              </div>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex space-x-1 p-4 bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Entry Panel</h1>
              <p className="text-gray-600 mt-1">Manage platform data, {user?.name || 'Employee'}! 📊</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-700">Active</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </section>
      )}

      {/* Mobile Content */}
      {isMobile && (
        <div className="px-2 py-4">
          {renderTabContent()}
        </div>
      )}

      {/* Add Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add New {activeTab === 'locations' ? 'Location' : 'Category'}
            </h3>
            <p className="text-gray-600 mb-4">Form implementation coming soon...</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}