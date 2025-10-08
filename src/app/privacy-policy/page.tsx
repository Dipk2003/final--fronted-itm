import { Navbar, Footer } from '@/shared/components';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Business information (company name, GST number, address)</li>
                  <li>Financial information (payment details, bank information)</li>
                  <li>Profile information (product preferences, business category)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect and defend our rights and property</li>
                  <li>With trusted service providers who assist us in operating our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                <p className="text-gray-700">
                  We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookies through your browser settings, but this may affect the functionality of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Access, update, or delete your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@indiantrademart.com<br />
                    <strong>Phone:</strong> +91 7290010051<br />
                     <strong>Phone:</strong> +91 7290010052<br />
                    <strong>Address:</strong> Indian Trade Mart Pvt. Ltd., 123 Business Hub, Tech City, Gurgaon, Haryana 122001
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
