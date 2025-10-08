import { Navbar, Footer } from '@/shared/components';
import { Search, MessageCircle, Phone, Mail } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      question: "How do I register as a supplier on Indian Trade Mart?",
      answer: "To register as a supplier, click on 'Vendor' in the navigation menu and select 'Register'. Fill in your business details, upload required documents, and complete the verification process."
    },
    {
      question: "How can I search for products or suppliers?",
      answer: "Use the search bar at the top of the page to search for products, categories, or suppliers. You can also browse categories or use advanced filters to narrow down your search."
    },
    {
      question: "What documents are required for supplier verification?",
      answer: "You'll need to provide GST certificate, business registration documents, PAN card, bank details, and any relevant industry certifications or licenses."
    },
    {
      question: "How does the payment process work?",
      answer: "Indian Trade Mart supports secure payment gateways. You can pay using credit/debit cards, net banking, UPI, or digital wallets. All transactions are encrypted and secure."
    },
    {
      question: "Can I track my orders?",
      answer: "Yes, you can track all your orders through your dashboard. You'll receive real-time updates on order status, shipping, and delivery."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team via email at support@indiantrademart.com, phone at +91 9876543210, or use the live chat feature on our website."
    },
    {
      question: "What are the charges for listing products?",
      answer: "Basic product listing is free. We offer premium listing options with additional features at competitive rates. Check our pricing page for detailed information."
    },
    {
      question: "How do I update my business profile?",
      answer: "Log in to your account and go to the 'Profile' section in your dashboard. You can update your business information, contact details, and upload new documents."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
          
          {/* Search Help */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick Help Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <MessageCircle className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-700 mb-4">Get instant help from our support team</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Phone className="mx-auto text-green-600 mb-4" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Support</h3>
              <p className="text-gray-700 mb-4">Speak directly with our team</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Call Now
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <Mail className="mx-auto text-purple-600 mb-4" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-700 mb-4">Send us your questions</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Send Email
              </button>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Help Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Account Registration</h3>
                <p className="text-sm text-gray-600">Learn how to create and verify your account</p>
              </a>
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Product Listing</h3>
                <p className="text-sm text-gray-600">Guide to listing and managing products</p>
              </a>
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Payment & Billing</h3>
                <p className="text-sm text-gray-600">Information about payments and invoicing</p>
              </a>
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Order Management</h3>
                <p className="text-sm text-gray-600">Track and manage your orders</p>
              </a>
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Shipping & Delivery</h3>
                <p className="text-sm text-gray-600">Shipping options and delivery tracking</p>
              </a>
              <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Returns & Refunds</h3>
                <p className="text-sm text-gray-600">Policy and process for returns</p>
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Still Need Help */}
          <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-700 mb-6">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Contact Support
              </a>
              <a
                href="/complaints"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                File a Complaint
              </a>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
