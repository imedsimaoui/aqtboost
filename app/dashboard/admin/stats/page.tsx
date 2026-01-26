import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminStatsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const [
    totalOrders,
    totalUsers,
    totalRevenue,
    completedOrders,
    pendingOrders,
    inProgressOrders,
    customers,
    boosters,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { price: true } }),
    prisma.order.count({ where: { status: 'completed' } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: 'in-progress' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'BOOSTER' } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const topBoosters = await prisma.boosterProfile.findMany({
    take: 5,
    orderBy: { totalOrders: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600 mt-1">Platform overview and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium">Total Revenue</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">
            €{(totalRevenue._sum.price || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium">Total Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium">Completed Orders</div>
          <div className="text-3xl font-bold text-accent-600 mt-2">{completedOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium mb-2">Order Status</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending</span>
              <span className="font-bold text-yellow-600">{pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="font-bold text-blue-600">{inProgressOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <span className="font-bold text-green-600">{completedOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium mb-2">User Distribution</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Customers</span>
              <span className="font-bold text-blue-600">{customers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Boosters</span>
              <span className="font-bold text-purple-600">{boosters}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Admins</span>
              <span className="font-bold text-red-600">{totalUsers - customers - boosters}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-sm text-gray-600 font-medium mb-2">Performance</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completion Rate</span>
              <span className="font-bold">
                {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Order Value</span>
              <span className="font-bold">
                €{totalOrders > 0 ? ((totalRevenue._sum.price || 0) / totalOrders).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{order.orderNumber}</div>
                  <div className="text-xs text-gray-600">{order.game}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">€{order.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Boosters</h2>
          <div className="space-y-3">
            {topBoosters.map((booster) => (
              <div key={booster.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{booster.user.name}</div>
                  <div className="text-xs text-gray-600">{booster.user.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{booster.totalOrders} boosts</div>
                  <div className="text-xs text-gray-600">{booster.rating.toFixed(1)} ⭐</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
