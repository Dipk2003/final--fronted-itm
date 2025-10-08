'use client';

import { useState } from 'react';
import { AuthGuard } from '@/modules/core';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% from last month
          </p>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

const CTODashboardTabs = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'overview', label: 'System Overview', icon: '📊' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'development', label: 'Development', icon: '👨‍💻' },
    { id: 'database', label: 'Database', icon: '🗄️' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-1">
      <nav className="flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } px-3 py-2 font-medium text-sm rounded-md flex items-center space-x-2 transition-colors`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const SystemOverview = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total API Calls" value="2.4M" icon="🔌" trend={{ value: 12, positive: true }} />
      <StatCard title="System Uptime" value="99.8%" icon="⏰" trend={{ value: 0.2, positive: true }} />
      <StatCard title="Active Users" value="1,247" icon="👥" trend={{ value: 8, positive: true }} />
      <StatCard title="Database Size" value="15.2 GB" icon="💾" trend={{ value: 5, positive: false }} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Recent Deployments</h3>
        <div className="space-y-4">
          {[
            { version: 'v2.1.3', date: '2025-01-17', status: 'Success', changes: '+5 features, -3 bugs' },
            { version: 'v2.1.2', date: '2025-01-15', status: 'Success', changes: '+2 features, -5 bugs' },
            { version: 'v2.1.1', date: '2025-01-12', status: 'Success', changes: '+1 feature, -2 bugs' },
          ].map((deployment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{deployment.version}</p>
                <p className="text-sm text-gray-600">{deployment.changes}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">{deployment.status}</p>
                <p className="text-xs text-gray-500">{deployment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 System Health</h3>
        <div className="space-y-4">
          {[
            { service: 'API Gateway', status: 'Healthy', uptime: '99.9%', color: 'green' },
            { service: 'Database', status: 'Healthy', uptime: '99.8%', color: 'green' },
            { service: 'Redis Cache', status: 'Warning', uptime: '98.5%', color: 'yellow' },
            { service: 'File Storage', status: 'Healthy', uptime: '99.7%', color: 'green' },
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-${service.color}-400`}></div>
                <span className="font-medium text-gray-900">{service.service}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{service.status}</p>
                <p className="text-xs text-gray-500">{service.uptime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const InfrastructureTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Server Load" value="68%" icon="🖥️" trend={{ value: 12, positive: false }} />
      <StatCard title="Memory Usage" value="4.2/8 GB" icon="🧠" trend={{ value: 5, positive: false }} />
      <StatCard title="Disk Space" value="152/500 GB" icon="💿" trend={{ value: 8, positive: false }} />
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Infrastructure Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Production Server', status: 'Online', load: '68%', location: 'Mumbai' },
          { name: 'Staging Server', status: 'Online', load: '35%', location: 'Delhi' },
          { name: 'Database Server', status: 'Online', load: '42%', location: 'Mumbai' },
          { name: 'CDN', status: 'Online', load: '23%', location: 'Global' },
        ].map((server, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{server.name}</h4>
              <span className="text-green-600 text-sm">●  {server.status}</span>
            </div>
            <p className="text-sm text-gray-600">Load: {server.load}</p>
            <p className="text-sm text-gray-600">Location: {server.location}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Security Score" value="95%" icon="🛡️" trend={{ value: 2, positive: true }} />
      <StatCard title="Failed Logins" value="23" icon="🚫" trend={{ value: 15, positive: false }} />
      <StatCard title="SSL Certificates" value="Valid" icon="🔐" />
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security Events</h3>
      <div className="space-y-3">
        {[
          { type: 'Login Attempt', severity: 'Low', time: '2 min ago', details: 'Failed login from IP: 192.168.1.100' },
          { type: 'SSL Renewal', severity: 'Info', time: '1 hour ago', details: 'SSL certificate auto-renewed successfully' },
          { type: 'Firewall Block', severity: 'Medium', time: '3 hours ago', details: 'Blocked suspicious traffic from multiple IPs' },
        ].map((event, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{event.type}</p>
              <p className="text-sm text-gray-600">{event.details}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.severity === 'High' ? 'bg-red-100 text-red-800' :
                event.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {event.severity}
              </span>
              <p className="text-xs text-gray-500 mt-1">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PerformanceTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Response Time" value="245ms" icon="⚡" trend={{ value: 8, positive: true }} />
      <StatCard title="Throughput" value="1,250 req/s" icon="🚀" trend={{ value: 15, positive: true }} />
      <StatCard title="Error Rate" value="0.02%" icon="❌" trend={{ value: 50, positive: true }} />
      <StatCard title="Cache Hit Rate" value="94.5%" icon="🎯" trend={{ value: 3, positive: true }} />
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Metrics</h3>
      <div className="text-center text-gray-500 py-8">
        <p>📊 Performance charts would be displayed here</p>
        <p className="text-sm">Integration with monitoring tools like Grafana/New Relic</p>
      </div>
    </div>
  </div>
);

const DevelopmentTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Active PRs" value="12" icon="🔀" />
      <StatCard title="Code Coverage" value="87%" icon="🧪" trend={{ value: 3, positive: true }} />
      <StatCard title="Technical Debt" value="Medium" icon="⚠️" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👨‍💻 Development Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'Pull Request', title: 'Add new authentication system', author: 'John Doe', status: 'Open' },
            { type: 'Bug Fix', title: 'Fix payment gateway issue', author: 'Jane Smith', status: 'Merged' },
            { type: 'Feature', title: 'Implement dark mode', author: 'Bob Johnson', status: 'Review' },
          ].map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'Merged' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.type} by {item.author}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Sprint Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sprint 23 Progress</span>
              <span className="text-sm text-gray-500">8/12 tasks completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { task: 'User Authentication', status: 'Complete', progress: 100 },
              { task: 'Payment Integration', status: 'In Progress', progress: 75 },
              { task: 'Admin Dashboard', status: 'In Progress', progress: 45 },
              { task: 'Mobile Responsive', status: 'Todo', progress: 0 },
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">{task.task}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'Complete' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DatabaseTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Database Size" value="15.2 GB" icon="💾" trend={{ value: 5, positive: false }} />
      <StatCard title="Active Connections" value="45" icon="🔗" />
      <StatCard title="Query Performance" value="12ms avg" icon="⚡" trend={{ value: 8, positive: true }} />
      <StatCard title="Backup Status" value="Success" icon="💿" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🗄️ Database Overview</h3>
        <div className="space-y-3">
          {[
            { name: 'Users Table', records: '1,247 rows', size: '2.3 MB' },
            { name: 'Products Table', records: '5,891 rows', size: '12.7 MB' },
            { name: 'Orders Table', records: '3,456 rows', size: '8.9 MB' },
            { name: 'Categories Table', records: '234 rows', size: '0.5 MB' },
          ].map((table, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-900">{table.name}</p>
                <p className="text-sm text-gray-500">{table.size}</p>
              </div>
              <p className="text-sm text-gray-600">{table.records}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Database Performance</h3>
        <div className="space-y-4">
          {[
            { metric: 'Query Response Time', value: '12ms avg', status: 'Good' },
            { metric: 'Cache Hit Ratio', value: '94.2%', status: 'Excellent' },
            { metric: 'Connection Pool', value: '45/100 active', status: 'Good' },
            { metric: 'Lock Wait Time', value: '0.02ms avg', status: 'Excellent' },
          ].map((metric, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{metric.metric}</p>
                <p className="text-sm text-gray-600">{metric.value}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                metric.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                metric.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {metric.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function CTODashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemOverview />;
      case 'infrastructure':
        return <InfrastructureTab />;
      case 'security':
        return <SecurityTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'development':
        return <DevelopmentTab />;
      case 'database':
        return <DatabaseTab />;
      default:
        return <SystemOverview />;
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN', 'ROLE_CTO', 'CTO']}>
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CTO Dashboard</h1>
          <div className="text-sm text-gray-500">
            Technical Overview & System Management 🚀
          </div>
        </div>
        
        <CTODashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </section>
    </AuthGuard>
  )
}
