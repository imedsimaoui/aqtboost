import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ChatWidget from '@/components/chat/ChatWidget';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      boosterProfile: {
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      },
    },
  });

  const getStats = () => {
    if (user?.role === 'CUSTOMER') {
      const totalOrders = user.orders.length;
      const activeOrders = user.orders.filter(o => o.status !== 'completed').length;
      const completedOrders = user.orders.filter(o => o.status === 'completed').length;
      return { totalOrders, activeOrders, completedOrders };
    } else if (user?.role === 'BOOSTER') {
      const totalBoosts = user.boosterProfile?.totalOrders || 0;
      const activeBoosts = user.boosterProfile?.orders.filter(o => o.status !== 'completed').length || 0;
      const rating = user.boosterProfile?.rating || 5.0;
      return { totalBoosts, activeBoosts, rating };
    }
    return null;
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'CUSTOMER' && 'Manage your orders and track your progress'}
          {user?.role === 'BOOSTER' && 'Find new orders and manage your boosts'}
          {user?.role === 'ADMIN' && 'Manage the platform and monitor activity'}
        </p>
      </div>

      {user?.role === 'CUSTOMER' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Active Orders</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">{stats.activeOrders}</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Completed</div>
              <div className="text-3xl font-bold text-accent-600 mt-2">{stats.completedOrders}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link href="/dashboard/orders">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            {user.orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link href="/order">
                  <Button variant="primary">Create Your First Order</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.game} - {order.service}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.currentRank} → {order.desiredRank}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">€{order.price.toFixed(2)}</div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {user?.role === 'BOOSTER' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Total Boosts</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBoosts}</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Active Boosts</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">{stats.activeBoosts}</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="text-sm text-gray-600 font-medium">Rating</div>
              <div className="text-3xl font-bold text-accent-600 mt-2">{stats.rating.toFixed(1)} ⭐</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/dashboard/booster/available">
                  <Button variant="primary" className="w-full">Find New Orders</Button>
                </Link>
                <Link href="/dashboard/booster/my-orders">
                  <Button variant="secondary" className="w-full">My Active Boosts</Button>
                </Link>
              </div>
            </div>

            {user.boosterProfile?.orders && user.boosterProfile.orders.length > 0 && (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Boosts</h2>
                <div className="space-y-3">
                  {user.boosterProfile.orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 text-sm">{order.orderNumber}</div>
                      <div className="text-xs text-gray-600 mt-1">{order.game}</div>
                      <div className="text-xs text-gray-500">{order.currentRank} → {order.desiredRank}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/admin/orders">
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and manage all platform orders</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/users">
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/applications">
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Applications</h3>
              <p className="text-sm text-gray-600">Review booster applications</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/stats">
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Statistics</h3>
              <p className="text-sm text-gray-600">View platform statistics and analytics</p>
            </div>
          </Link>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}
