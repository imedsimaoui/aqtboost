'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface UpdateProgressButtonProps {
  orderId: string;
  currentProgress: number;
}

export default function UpdateProgressButton({ orderId, currentProgress }: UpdateProgressButtonProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(currentProgress);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        setShowModal(false);
        router.refresh();
      } else {
        alert('Failed to update progress');
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setShowModal(true)} className="w-full">
        Update Progress
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Progress</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
