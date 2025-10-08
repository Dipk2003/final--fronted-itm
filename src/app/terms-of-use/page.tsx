export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Use</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing or using our services, you agree to be bound by these Terms of Use and our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Changes to Terms</h2>
                <p className="text-gray-700">
                  We may update these Terms of Use from time to time. We will notify you of any changes by posting the new Terms on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use of Services</h2>
                <p className="text-gray-700">
                  You agree to use our services only for lawful purposes and in accordance with all applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Account Information</h2>
                <p className="text-gray-700">
                  You must provide accurate and up-to-date information during the account registration process and keep your login credentials secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                <p className="text-gray-700">
                  All content on our platform, including text, graphics, logos, and images, is our property or the property of our licensors and is protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700">
                  We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of or related to your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms are governed by and construed in accordance with the laws of India, and any disputes relating to these Terms will be subject to the exclusive jurisdiction of the courts of India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Use, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> terms@indiantrademart.com<br />
                    <strong>Phone:</strong> +91 9876543210<br />
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
