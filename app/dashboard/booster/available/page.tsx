import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';
import ClaimOrderButton from '@/components/booster/ClaimOrderButton';

export default async function AvailableOrdersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'BOOSTER') {
    redirect('/dashboard');
  }

  const availableOrders = await prisma.order.findMany({
    where: {
      boosterId: null,
      status: 'pending',
      paymentStatus: 'completed',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Orders</h1>
        <p className="text-gray-600 mt-1">Claim orders and start boosting</p>
      </div>

      {availableOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No available orders</h3>
          <p className="text-gray-600">Check back later for new boosting opportunities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {availableOrders.map((order) => {
            const options = order.options as any;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.game}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">€{order.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600">Service</div>
                    <div className="font-medium">{order.service}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Current Rank</div>
                    <div className="font-medium">{order.currentRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Desired Rank</div>
                    <div className="font-medium">{order.desiredRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Priority</div>
                    <div className="font-medium">{options?.priority ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {(options?.duoQueue || options?.specificChampions || options?.streaming) && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {options.duoQueue && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Duo Queue</span>
                    )}
                    {options.specificChampions && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Specific Champions</span>
                    )}
                    {options.streaming && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Streaming</span>
                    )}
                  </div>
                )}

                <ClaimOrderButton orderId={order.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
