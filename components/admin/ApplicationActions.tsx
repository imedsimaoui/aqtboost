'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface ApplicationActionsProps {
  application: {
    id: string;
    status: string;
    email: string;
  };
}

export default function ApplicationActions({ application }: ApplicationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Approve this application and create booster account?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${application.id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to approve application');
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const notes = prompt('Reason for rejection (optional):');
    if (notes === null) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${application.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to reject application');
      }
    } catch (error) {
      console.error('Failed to reject application:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (application.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Button
        variant="primary"
        onClick={handleApprove}
        disabled={loading}
        className="flex-1"
      >
        {loading ? 'Processing...' : 'Approve & Create Account'}
      </Button>
      <Button
        variant="secondary"
        onClick={handleReject}
        disabled={loading}
        className="flex-1"
      >
        Reject
      </Button>
    </div>
  );
}
