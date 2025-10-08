'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const EmployeeAnalytics = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data for analytics
  const categoryData = [
    { name: 'Electronics', count: 45, color: '#3B82F6' },
    { name: 'Fashion', count: 32, color: '#10B981' },
    { name: 'Home & Garden', count: 28, color: '#F59E0B' },
    { name: 'Sports', count: 15, color: '#EF4444' },
    { name: 'Books', count: 12, color: '#8B5CF6' }
  ];

  const locationData = [
    { city: 'Mumbai', entries: 25 },
    { city: 'Delhi', entries: 22 },
    { city: 'Bangalore', entries: 18 },
    { city: 'Chennai', entries: 15 },
    { city: 'Kolkata', entries: 12 }
  ];

  const dailyActivity = [
    { day: 'Mon', entries: 8 },
    { day: 'Tue', entries: 12 },
    { day: 'Wed', entries: 15 },
    { day: 'Thu', entries: 10 },
    { day: 'Fri', entries: 18 },
    { day: 'Sat', entries: 6 },
    { day: 'Sun', entries: 4 }
  ];

  const stats = [
    { 
      title: 'Categories Added', 
      value: '132', 
      change: '+12%', 
      positive: true,
      icon: '📋',
      color: 'blue'
    },
    { 
      title: 'Locations Updated', 
      value: '85', 
      change: '+8%', 
      positive: true,
      icon: '📍',
      color: 'green'
    },
    { 
      title: 'Data Quality', 
      value: '94.5%', 
      change: '+2.1%', 
      positive: true,
      icon: '✅',
      color: 'purple'
    },
    { 
      title: 'Tasks Completed', 
      value: '47', 
      change: '+15%', 
      positive: true,
      icon: '🎯',
      color: 'orange'
    }
  ];

  const StatCard = ({ stat }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'text-center' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-2xl ${isMobile ? 'mx-auto mb-2' : ''}`}>{stat.icon}</div>
        <div className={`flex items-center text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
          <span>{stat.change}</span>
          <svg 
            className={`w-4 h-4 ml-1 ${stat.positive ? 'rotate-0' : 'rotate-180'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold text-gray-900 ${isMobile ? 'text-xl' : ''}`}>
          {stat.value}
        </div>
        <div className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
          {stat.title}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-600 mt-1">Your data entry performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-2 md:grid-cols-4 gap-6'}`}>
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
              <p className="text-gray-600 text-sm">Entries per day this week</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
          <div style={{ width: '100%', height: isMobile ? 200 : 300 }}>
            <ResponsiveContainer>
              <LineChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
              <p className="text-gray-600 text-sm">Categories managed by you</p>
            </div>
            <div className="text-2xl">🥧</div>
          </div>
          <div style={{ width: '100%', height: isMobile ? 200 : 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Location Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Cities</h3>
            <p className="text-gray-600 text-sm">Most active locations you've managed</p>
          </div>
          <div className="text-2xl">🏙️</div>
        </div>
        <div style={{ width: '100%', height: isMobile ? 250 : 350 }}>
          <ResponsiveContainer>
            <BarChart data={locationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                dataKey="city" 
                type="category" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 60 : 80}
              />
              <Tooltip />
              <Bar dataKey="entries" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600 text-sm">Your latest data entry tasks</p>
          </div>
          <div className="text-2xl">⏱️</div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-900 font-medium">Added 5 new electronics subcategories</p>
                <span className="text-xs text-gray-500 mt-1 sm:mt-0">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Mobile Accessories, Laptop Parts, Gaming Gear</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-900 font-medium">Updated Mumbai pincode database</p>
                <span className="text-xs text-gray-500 mt-1 sm:mt-0">4 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Added 12 new pincodes in Thane district</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-900 font-medium">Completed data quality audit</p>
                <span className="text-xs text-gray-500 mt-1 sm:mt-0">Yesterday</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Reviewed and validated 500+ product entries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Performance Insights</h3>
            <p className="text-indigo-100 text-sm">Your work summary</p>
          </div>
          <div className="text-3xl">🎉</div>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} mt-6`}>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-indigo-100 text-sm">Accuracy Rate</div>
            <div className="text-xs text-indigo-200 mt-1">Above average ↗</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">73</div>
            <div className="text-indigo-100 text-sm">Entries/Day</div>
            <div className="text-xs text-indigo-200 mt-1">High productivity ↗</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="text-indigo-100 text-sm">Quality Score</div>
            <div className="text-xs text-indigo-200 mt-1">Excellent work ✨</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;