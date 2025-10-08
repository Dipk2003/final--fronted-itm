export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        
        {/* Company Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Indian Trade Mart</h4>
          <p>Connecting businesses with trusted technology providers.</p>
        </div>

        {/* Info Links */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900 mb-2">Information</h4>
          <a href="/about-us" className="block hover:underline">About Us</a>
          <a href="/press-section" className="block hover:underline">Press Section</a>
          <a href="/investor-section" className="block hover:underline">Investor Section</a>
          <a href="/join-sales" className="block hover:underline">Join Sales</a>
          <a href="/success-stories" className="block hover:underline">Success Stories</a>
        </div>

        {/* Customer Support */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
          <a href="/help" className="block hover:underline">Help</a>
          <a href="/customer-care" className="block hover:underline">Customer Care</a>
          <a href="/complaints" className="block hover:underline">Complaints</a>
          <a href="/jobs-careers" className="block hover:underline">Jobs & Careers</a>
          <a href="/contact-us" className="block hover:underline">Contact Us</a>
        </div>

        {/* Suppliers Tool Kit */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900 mb-2">Suppliers Tool Kit</h4>
          <a href="/sell-on-trade-mart" className="block hover:underline">Sell on Trade Mart</a>
          <a href="/latest-buylead" className="block hover:underline">Latest BuyLead</a>
          <a href="/learning-centre" className="block hover:underline">Learning Centre</a>
          <a href="/ship-with-trade-mart" className="block hover:underline">Ship With Trade Mart</a>
        </div>

        {/* Buyers Tool Kit */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900 mb-2">Buyers Tool Kit</h4>
          <a href="/post-requirement" className="block hover:underline">Post Requirement</a>
          <a href="/products-you-buy" className="block hover:underline">Products You Buy</a>
          <a href="/search-suppliers" className="block hover:underline">Search Suppliers</a>
        </div>
      </div>

      {/* Contact Emails */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
         {/*  <p><strong>Info:</strong> info@indiantrademart.com</p>
          <p><strong>Business Development:</strong> bd@indiantrademart.com</p> */}
          <p><strong>Customer Care:</strong> customercare@indiantrademart.com</p>
        </div>
        <div>
          {/*<p><strong>KYC OTP:</strong> kyc@indiantrademart.com</p>
            <p><strong>HR:</strong> hr@indiantrademart.com</p>
          */}
          <p><strong>Support:</strong> support@indiantrademart.com</p>
          
        </div>
        <div>
          <p><strong>Business:</strong> business@indiantrademart.com</p>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t text-center text-xs text-gray-500 py-4">
        <p>
          © {new Date().getFullYear()} Indian Trade Mart. All rights reserved. 
          &nbsp;|&nbsp; <a href="/terms-of-use" className="hover:underline">Terms of Use</a>
          &nbsp;|&nbsp; <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          &nbsp;|&nbsp; <a href="/link-to-us" className="hover:underline">Link to Us</a>
        </p>
      </div>
    </footer>
  );
}
