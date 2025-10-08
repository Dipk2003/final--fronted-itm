import React, { useEffect, useState } from 'react';
import { inquiryQuoteAPI, type Quote } from '@/shared/services/inquiryQuoteApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';

export default function UserQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingQuote, setAcceptingQuote] = useState<number | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await inquiryQuoteAPI.quotes.getUserQuotes();
      setQuotes(response.content);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: number) => {
    if (!confirm('Are you sure you want to accept this quote?')) {
      return;
    }

    try {
      setAcceptingQuote(quoteId);
      await inquiryQuoteAPI.quotes.accept(quoteId);
      fetchQuotes(); // Refresh quotes
      alert('Quote accepted successfully! The vendor has been notified.');
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Failed to accept quote. Please try again.');
    } finally {
      setAcceptingQuote(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price?: number, currency = 'INR') => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (loading) {
    return <div className="text-center">Loading your quotes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Received Quotes</h1>
        <Button onClick={fetchQuotes} variant="outline">
          Refresh
        </Button>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No quotes received yet. Send some inquiries to get quotes from vendors!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className={`border-l-4 ${
              quote.status === 'ACCEPTED' 
                ? 'border-l-green-500 bg-green-50' 
                : 'border-l-blue-500'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Quote #{quote.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      From: {quote.vendor?.companyName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Received: {formatDate(quote.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'ACCEPTED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {quote.status === 'ACCEPTED' ? 'Accepted' : quote.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quote Details:</p>
                    <p className="text-sm text-gray-800">{quote.terms}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Price:</p>
                      <p className="text-gray-900">{formatPrice(quote.price)}</p>
                    </div>
                    {quote.quantity && (
                      <div>
                        <p className="font-medium text-gray-700">Quantity:</p>
                        <p className="text-gray-900">{quote.quantity}</p>
                      </div>
                    )}
                    {quote.deliveryTime && (
                      <div>
                        <p className="font-medium text-gray-700">Delivery:</p>
                        <p className="text-gray-900">{quote.deliveryTime}</p>
                      </div>
                    )}
                    {quote.validUntil && (
                      <div>
                        <p className="font-medium text-gray-700">Valid Until:</p>
                        <p className="text-gray-900">{formatDate(quote.validUntil)}</p>
                      </div>
                    )}
                  </div>

                  {quote.status !== 'ACCEPTED' && (
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button
                        onClick={() => handleAcceptQuote(quote.id)}
                        disabled={acceptingQuote === quote.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {acceptingQuote === quote.id ? 'Accepting...' : 'Accept Quote'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`mailto:${quote.vendor?.contactEmail}`, '_blank')}
                      >
                        Contact Vendor
                      </Button>
                      <Button variant="outline">
                        Negotiate
                      </Button>
                    </div>
                  )}

                  {quote.status === 'ACCEPTED' && (
                    <div className="pt-4 border-t bg-green-50 p-3 rounded-md">
                      <p className="text-green-800 font-medium">✓ Quote Accepted</p>
                      <p className="text-green-700 text-sm">
                        Please contact the vendor to proceed with your order.
                      </p>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:${quote.vendor?.contactEmail}`, '_blank')}
                        >
                          Contact Vendor
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
