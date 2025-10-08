import { Navbar, Footer } from '@/shared/components';
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';

export default function Complaints() {
  const complaintTypes = [
    "Product Quality Issue",
    "Delivery Problem",
    "Payment Issue",
    "Vendor Behavior",
    "Technical Problem",
    "Account Issue",
    "Other"
  ];

  const complaintProcess = [
    {
      step: 1,
      title: "Submit Complaint",
      description: "Fill out the complaint form with detailed information",
      icon: MessageSquare,
      color: "blue"
    },
    {
      step: 2,
      title: "Review & Acknowledgment",
      description: "We review your complaint and send acknowledgment within 24 hours",
      icon: Clock,
      color: "yellow"
    },
    {
      step: 3,
      title: "Investigation",
      description: "Our team investigates the issue and contacts relevant parties",
      icon: AlertCircle,
      color: "orange"
    },
    {
      step: 4,
      title: "Resolution",
      description: "We provide a resolution and follow up to ensure satisfaction",
      icon: CheckCircle,
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
 
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">File a Complaint</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We take your concerns seriously. Please provide detailed information about your issue so we can help resolve it quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complaint Details</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order ID (if applicable)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Order number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Type *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select complaint type</option>
                    {complaintTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your complaint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide detailed information about your complaint, including dates, vendor names, and any relevant details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload screenshots, receipts, or other relevant documents (Max 5 files, 10MB each)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Resolution
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What outcome would you like from this complaint?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
          </div>

          {/* Complaint Process */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Handle Complaints</h3>
              <div className="space-y-4">
                {complaintProcess.map((process, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-${process.color}-100`}>
                      <process.icon className={`text-${process.color}-600`} size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{process.title}</h4>
                      <p className="text-sm text-gray-600">{process.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700">
                We typically respond to complaints within 24-48 hours. For urgent issues, please call our support line at +91 9876543210.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Email:</strong> complaints@indiantrademart.com
                </div>
                <div>
                  <strong>Phone:</strong> +91 9876543210
                </div>
                <div>
                  <strong>Hours:</strong> Mon-Fri 9AM-6PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
