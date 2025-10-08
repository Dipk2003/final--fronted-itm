'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge } from '@/shared/components';
import { kycApi, KycDocument } from '@/shared/services/api/kycApi';

interface KycReviewDashboardProps {
  onNavigate?: (view: string) => void;
}

export default function KycReviewDashboard({ onNavigate }: KycReviewDashboardProps) {
  const [pendingDocuments, setPendingDocuments] = useState<KycDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KycDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const documents = await kycApi.getPendingDocuments();
      setPendingDocuments(documents);
    } catch (error) {
      console.error('Error fetching pending documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: number) => {
    try {
      await kycApi.approveDocument(documentId, 1); // Admin ID - should be dynamic
      await fetchPendingDocuments();
      alert('Document approved successfully!');
    } catch (error) {
      console.error('Error approving document:', error);
      alert('Failed to approve document');
    }
  };

  const handleReject = async () => {
    if (!selectedDocument || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await kycApi.rejectDocument(selectedDocument.id, 1, rejectionReason); // Admin ID - should be dynamic
      await fetchPendingDocuments();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedDocument(null);
      alert('Document rejected successfully!');
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert('Failed to reject document');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeDisplay = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">KYC Document Review</h2>
        <Button
          onClick={() => fetchPendingDocuments()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {pendingDocuments.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No Pending Documents</h3>
              <p>All KYC documents have been reviewed.</p>
            </div>
          </Card>
        ) : (
          pendingDocuments.map((document) => (
            <Card key={document.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {getDocumentTypeDisplay(document.documentType)}
                    </h3>
                    <Badge className={getStatusBadgeColor(document.status)}>
                      {document.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>File:</strong> {document.originalFileName}</p>
                    <p><strong>Submitted:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
                    <p><strong>Document ID:</strong> {document.id}</p>
                  </div>

                  {document.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {document.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleApprove(document.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedDocument(document);
                      setShowRejectModal(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => window.open(`/api/kyc/view/${document.id}`, '_blank')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this document:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Reject Document
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedDocument(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
