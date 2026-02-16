import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notes } = await request.json();

    const application = await prisma.boosterApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json({ error: 'Application already processed' }, { status: 400 });
    }

    await prisma.boosterApplication.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        notes: notes || 'Application rejected',
      },
    });

    return NextResponse.json({ message: 'Application rejected' }, { status: 200 });
  } catch (error) {
    console.error('Failed to reject application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
