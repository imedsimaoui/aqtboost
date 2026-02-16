import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'BOOSTER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { progress } = await request.json();

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return NextResponse.json({ error: 'Invalid progress value' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { booster: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { boosterProfile: true },
    });

    if (order.boosterId !== user?.boosterProfile?.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        progress,
        status: progress === 100 ? 'completed' : 'in-progress',
      },
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
