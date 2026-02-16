import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    const application = await prisma.boosterApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json({ error: 'Application already processed' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: application.name,
        email: application.email,
        password: hashedPassword,
        role: 'BOOSTER',
        discord: application.discord,
        boosterProfile: {
          create: {
            games: application.games,
            rank: application.ranks.split(',')[0].trim(),
            rating: 5.0,
            totalOrders: 0,
            isActive: true,
          },
        },
      },
    });

    await prisma.boosterApplication.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        notes: `Approved. Temporary password: ${tempPassword}`,
      },
    });

    return NextResponse.json({
      message: 'Application approved',
      user: { id: user.id, email: user.email, tempPassword },
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to approve application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
