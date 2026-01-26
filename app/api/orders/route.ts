import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice, estimateTime } from '@/lib/pricing';

// Générer un numéro de commande unique
function generateOrderNumber(): string {
  const prefix = 'AQT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      game,
      service,
      currentRank,
      desiredRank,
      options = {},
      customerEmail,
      customerName,
      customerDiscord,
    } = body;

    // Validation basique
    if (!game || !service || !currentRank || !desiredRank || !customerEmail) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Calcul du prix
    const price = calculatePrice({
      game,
      service,
      currentRank,
      desiredRank,
      options,
    });

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        game,
        service,
        currentRank,
        desiredRank,
        options: JSON.stringify(options),
        price,
        customerEmail,
        customerName,
        customerDiscord,
        status: 'pending',
        paymentStatus: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        price: order.price,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Commande non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    if (email) {
      const orders = await prisma.order.findMany({
        where: { customerEmail: email },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ orders });
    }

    return NextResponse.json(
      { error: 'Paramètres manquants' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
