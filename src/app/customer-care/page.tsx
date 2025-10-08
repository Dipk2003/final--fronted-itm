import React from 'react';
import { Navbar, Footer } from '@/shared/components';
import { Phone, Mail, MapPin, FileText, MessageCircle, Clock, Users, Star } from 'lucide-react';

const CustomerCarePage = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Customer Care</h1>
          <p>Your satisfaction is our priority. Get in touch with our dedicated customer care team.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <Phone className="inline-block mr-2" />
              <span>Call us: (123) 456-7890</span>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <Mail className="inline-block mr-2" />
              <span>Email: support@example.com</span>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <MapPin className="inline-block mr-2" />
              <span>Visit us: 123 Main Street, Anytown, USA</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
          <p>Find answers to common questions about our products and services.</p>
          <button className="text-blue-500 underline">View FAQs</button>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <FileText className="inline-block mr-2" />
              <span>Submit a ticket</span>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <FileText className="inline-block mr-2" />
              <span>Live chat</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
          <p>We value your feedback. Let us know how we can improve.</p>
          <button className="text-blue-500 underline">Give Feedback</button>
        </section>
      </main>

    </div>
  );
};

export default CustomerCarePage;

