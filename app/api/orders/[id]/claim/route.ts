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
    if (!session?.user || session.user.role !== 'BOOSTER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { boosterProfile: true },
    });

    if (!user?.boosterProfile) {
      return NextResponse.json({ error: 'Booster profile not found' }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.boosterId) {
      return NextResponse.json({ error: 'Order already claimed' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        boosterId: user.boosterProfile.id,
        status: 'in-progress',
      },
    });

    await prisma.boosterProfile.update({
      where: { id: user.boosterProfile.id },
      data: {
        totalOrders: { increment: 1 },
      },
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Failed to claim order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
