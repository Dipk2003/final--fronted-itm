'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Badge } from '@/shared/components';

interface SupportTicketFormProps {
  onSuccess?: () => void;
}

interface TicketData {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onSuccess }) => {
  const [ticketData, setTicketData] = useState<TicketData>({
    subject: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'GENERAL', label: 'General Inquiry' },
    { value: 'TECHNICAL', label: 'Technical Support' },
    { value: 'BILLING', label: 'Billing & Payment' },
    { value: 'PRODUCT', label: 'Product Issue' },
    { value: 'ACCOUNT', label: 'Account Problem' }
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Please login to submit a support ticket');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/support-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        setSuccess(true);
        setTicketData({
          subject: '',
          category: 'GENERAL',
          priority: 'MEDIUM',
          description: ''
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error('Failed to create support ticket');
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 text-lg font-semibold mb-2">
            ✓ Support Ticket Created Successfully!
          </div>
          <p className="text-green-700 mb-4">
            Your support ticket has been created. Our team will contact you within 24 hours.
          </p>
          <Badge className="bg-green-100 text-green-800">
            Ticket ID: #ST{Date.now().toString().slice(-6)}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Create Support Ticket
        </CardTitle>
        <p className="text-sm text-gray-600">
          Need help? Create a support ticket and our team will assist you.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <Input
              type="text"
              name="subject"
              value={ticketData.subject}
              onChange={handleInputChange}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={ticketData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={ticketData.priority}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={ticketData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Before submitting:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check our FAQ section for common issues</li>
              <li>• Provide as much detail as possible</li>
              <li>• Include error messages if any</li>
              <li>• Mention your browser/device if relevant</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={loading}
          >
            {loading ? 'Creating Ticket...' : 'Create Support Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportTicketForm;
