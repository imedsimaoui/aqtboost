import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import UpdateProgressButton from '@/components/booster/UpdateProgressButton';

export default async function MyBoostsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'BOOSTER') {
    redirect('/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      boosterProfile: {
        include: {
          orders: {
            where: {
              status: { not: 'completed' },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
  });

  const activeOrders = user?.boosterProfile?.orders || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Active Boosts</h1>
        <p className="text-gray-600 mt-1">Manage your current boosting orders</p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active boosts</h3>
          <p className="text-gray-600">Claim orders from the available orders page</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => {
            const options = order.options as any;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.game} - {order.service}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">€{order.price.toFixed(2)}</div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                      order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600">Current Rank</div>
                    <div className="font-medium">{order.currentRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Desired Rank</div>
                    <div className="font-medium">{order.desiredRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Customer</div>
                    <div className="font-medium text-sm">{order.customerEmail}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>

                <UpdateProgressButton orderId={order.id} currentProgress={order.progress} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
