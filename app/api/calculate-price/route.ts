import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice, estimateTime, PriceConfig } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body: PriceConfig = await request.json();

    const price = calculatePrice(body);
    const time = estimateTime(5, body.service); // Simple estimation

    return NextResponse.json({
      price,
      estimatedTime: time,
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul du prix' },
      { status: 500 }
    );
  }
}
