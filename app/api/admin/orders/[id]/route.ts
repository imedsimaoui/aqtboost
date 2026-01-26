import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Order deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
