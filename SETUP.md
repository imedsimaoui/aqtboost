# AQTBOOST - Complete Setup Guide

## Table of Contents
1. [Database Setup](#database-setup)
2. [Stripe Payment Integration](#stripe-payment-integration)
3. [Environment Variables](#environment-variables)
4. [Testing Orders](#testing-orders)
5. [Deployment](#deployment)

---

## Database Setup

### Current Setup (SQLite - Development)
The project is currently configured with SQLite for easy local development.

**Already done:**
- ✅ Prisma schema created
- ✅ Database migrations run
- ✅ Database file created at `prisma/dev.db`

**To view your database:**
```bash
npx prisma studio
```
This opens a web interface at http://localhost:5555 where you can view and edit your data.

### Production Setup (PostgreSQL Recommended)

For production, switch to PostgreSQL:

**1. Get a PostgreSQL database:**
- **Recommended:** [Supabase](https://supabase.com) (Free tier available)
- **Alternative:** [Railway](https://railway.app), [Neon](https://neon.tech), or [PlanetScale](https://planetscale.com)

**2. Update `prisma.config.ts`:**
```typescript
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"], // Your PostgreSQL URL
  },
});
```

**3. Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
}
```

**4. Run migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Stripe Payment Integration

### Step 1: Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Create an account
3. Get your API keys from Dashboard → Developers → API keys

### Step 2: Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

### Step 3: Add Environment Variables
Create `.env` file:
```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... # Your secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Get this after setting up webhooks
```

### Step 4: Create Payment API Route

Create `app/api/create-payment/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId, customerEmail } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        orderId,
      },
      receipt_email: customerEmail,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Payment Component

Create `components/PaymentForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?order=${orderNumber}`,
      },
    });

    if (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-primary-500 text-white py-3 rounded-lg mt-4"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentForm({ clientSecret, orderNumber }: { clientSecret: string; orderNumber: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm orderNumber={orderNumber} />
    </Elements>
  );
}
```

### Step 6: Update Order Page to Include Payment

After order creation, create payment intent:
```typescript
// In your order completion handler
const response = await fetch('/api/create-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: price,
    orderId: orderData.id,
    customerEmail: formData.customerEmail,
  }),
});

const { clientSecret } = await response.json();
// Show PaymentForm with clientSecret
```

### Step 7: Set Up Webhooks (Important!)

Webhooks ensure payment confirmations are processed:

1. **Local Testing with Stripe CLI:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

2. **Create Webhook Handler:**

Create `app/api/webhooks/stripe/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    // Update order in database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        paymentId: paymentIntent.id,
        status: 'in_progress',
      },
    });

    console.log(`Payment succeeded for order ${orderId}`);
  }

  return NextResponse.json({ received: true });
}
```

3. **Production Webhooks:**
- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the webhook secret to your `.env`

---

## Environment Variables

Complete `.env` file:
```env
# Database
DATABASE_URL="file:./dev.db"  # For SQLite
# DATABASE_URL="postgresql://user:password@host:5432/database"  # For PostgreSQL

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional - for order confirmations)
RESEND_API_KEY=re_...
```

---

## Testing Orders

### 1. Test the Order Flow

```bash
npm run dev
```

1. Go to http://localhost:3000/order
2. Fill out the form
3. Click "Create Order"
4. Note the order number

### 2. View Orders in Database

```bash
npx prisma studio
```

Navigate to the `Order` table to see all orders.

### 3. Test Stripe Payments

Use Stripe test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date
- Any 3-digit CVC

---

## Deployment

### Recommended: Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in Project Settings
- Deploy

3. **Setup Production Database:**
- Create PostgreSQL database (Supabase/Railway)
- Update `DATABASE_URL` in Vercel environment variables
- Run migrations: Vercel automatically runs `prisma generate` on deploy

4. **Setup Stripe Webhooks:**
- Add webhook endpoint in Stripe Dashboard
- Point to `https://yourdomain.com/api/webhooks/stripe`
- Update `STRIPE_WEBHOOK_SECRET` in Vercel

### Alternative: Railway/Render

Similar process - connect GitHub, add environment variables, deploy.

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# View database
npx prisma studio

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Support

If you encounter issues:
1. Check console for errors
2. Verify environment variables are set
3. Ensure database migrations are run
4. Test Stripe in test mode before going live

For questions, check:
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
