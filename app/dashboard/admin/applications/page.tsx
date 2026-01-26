import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ApplicationActions from '@/components/admin/ApplicationActions';

export default async function AdminApplicationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const applications = await prisma.boosterApplication.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booster Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage booster applications</p>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold">{applications.length}</span> applications
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Booster applications will appear here</p>
          </div>
        ) : (
          applications.map((application) => {
            const games = application.games as string[];
            return (
              <div key={application.id} className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{application.name}</h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
                    <p className="text-sm text-gray-600">Discord: {application.discord}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColors[application.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                      {application.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Age</div>
                    <div className="text-sm">{application.age} years old</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Games</div>
                    <div className="flex flex-wrap gap-1">
                      {games.map((game) => (
                        <span key={game} className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Peak Ranks</div>
                    <div className="text-sm">{application.ranks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Experience</div>
                    <div className="text-sm">{application.experience}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Availability</div>
                    <div className="text-sm">{application.availability}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Why AQTBOOST?</div>
                    <div className="text-sm">{application.why}</div>
                  </div>
                </div>

                {application.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 font-medium mb-1">Admin Notes</div>
                    <div className="text-sm">{application.notes}</div>
                  </div>
                )}

                <ApplicationActions application={application} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
