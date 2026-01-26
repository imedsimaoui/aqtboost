'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminOrderActionsProps {
  orderId: string;
}

export default function AdminOrderActions({ orderId }: AdminOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 text-sm font-medium"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
