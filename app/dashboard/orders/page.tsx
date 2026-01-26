import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'CUSTOMER') {
    redirect('/dashboard');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      booster: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View and track all your orders</p>
        </div>
        <Link href="/order">
          <Button variant="primary">New Order</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start your first boosting order today!</p>
          <Link href="/order">
            <Button variant="primary">Create Order</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const options = order.options as any;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.game} - {order.service}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">€{order.price.toFixed(2)}</div>
                    <span className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600">Current Rank</div>
                    <div className="font-medium">{order.currentRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Desired Rank</div>
                    <div className="font-medium">{order.desiredRank}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Booster</div>
                    <div className="font-medium text-sm">
                      {order.booster?.user.name || 'Not assigned yet'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Payment</div>
                    <div className="font-medium text-sm">{order.paymentStatus}</div>
                  </div>
                </div>

                {order.status === 'in-progress' && (
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
                )}

                {(options?.duoQueue || options?.specificChampions || options?.streaming || options?.priority) && (
                  <div className="flex flex-wrap gap-2">
                    {options.priority && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Priority</span>
                    )}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
