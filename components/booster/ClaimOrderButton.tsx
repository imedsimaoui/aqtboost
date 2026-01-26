'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface ClaimOrderButtonProps {
  orderId: string;
}

export default function ClaimOrderButton({ orderId }: ClaimOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/claim`, {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/dashboard/booster/my-orders');
        router.refresh();
      } else {
        alert('Failed to claim order');
      }
    } catch (error) {
      console.error('Failed to claim order:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleClaim}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Claiming...' : 'Claim Order'}
    </Button>
  );
}
