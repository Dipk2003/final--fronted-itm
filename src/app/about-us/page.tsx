import { Navbar, Footer } from '@/shared/components';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
   
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Indian Trade Mart</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              Indian Trade Mart is India's leading B2B marketplace connecting businesses with trusted technology providers and suppliers across the country.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  To revolutionize B2B trade in India by providing a comprehensive platform that enables businesses to connect, collaborate, and grow together. We strive to make business transactions more efficient, transparent, and accessible for all.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-700">
                  To become the most trusted and preferred B2B marketplace in India, empowering millions of businesses to achieve their full potential through digital transformation and seamless trade connections.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Indian Trade Mart?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Verified suppliers and buyers ensuring trust and reliability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Comprehensive product catalog across multiple industries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Advanced search and filtering capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Secure payment and transaction processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>24/7 customer support and assistance</span>
                </li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-700">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
                <div className="text-gray-700">Active Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-gray-700">Products Listed</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2024, Indian Trade Mart emerged from the vision of creating a digital ecosystem where businesses of all sizes could thrive. We recognized the challenges faced by traditional B2B trade and set out to build a platform that would bridge the gap between suppliers and buyers.
              </p>
              <p className="text-gray-700">
                Today, we serve thousands of businesses across India, from small manufacturers to large enterprises, helping them discover new opportunities, expand their reach, and grow their businesses in the digital age.
              </p>
            </div>
          </div>
        </div>
      </main>
  
    </div>
  );
}
