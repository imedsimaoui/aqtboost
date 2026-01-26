import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, discord, age, games, ranks, experience, availability, why } = body;

    if (!name || !email || !discord || !age || !games || games.length === 0 || !ranks || !experience || !availability || !why) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in or use a different email.' },
        { status: 400 }
      );
    }

    // Create booster application
    const application = await prisma.boosterApplication.create({
      data: {
        name,
        email,
        discord,
        age: parseInt(age),
        games,
        ranks,
        experience,
        availability,
        why,
        status: 'pending',
      },
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        application: {
          id: application.id,
          status: application.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booster application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
