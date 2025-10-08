'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { inquiryApi } from '@/lib/inquiryApi';

interface InquiryFormProps {
  productId: number;
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InquiryForm({ productId, userId, onSuccess, onCancel }: InquiryFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter your inquiry message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await inquiryApi.createInquiry({
        user: { id: userId },
        product: { id: productId },
        message: message.trim(),
        isResolved: false
      });

      setMessage('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Send Inquiry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe your requirements, quantity needed, or any questions about this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
