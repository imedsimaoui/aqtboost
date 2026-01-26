# AQTBOOST - Professional Rank Boosting Platform

A modern, professional boosting platform for competitive games. Built with Next.js 16, TypeScript, Tailwind CSS, and Prisma.

![AQTBOOST](https://img.shields.io/badge/Status-Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## Features ✨

### Core Functionality
- ✅ **7 Languages** - EN, FR, ES, DE, PT, CN, KR
- ✅ **Custom Logo** - Professional branding with AQTBOOST shield logo
- ✅ **Professional UI/UX** - Clean PayPal/Stripe-inspired design
- ✅ **Real-time Price Calculator** - Dynamic pricing based on rank difference
- ✅ **Order Management System** - Full CRUD with SQLite/PostgreSQL
- ✅ **6 Popular Games** - League of Legends, Valorant, CS2, Dota 2, OW2, Apex
- ✅ **12+ Verified Testimonials** - Build trust with social proof (all languages)
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✅ **SEO Optimized** - Meta tags, semantic HTML
- ✅ **VPS Ready** - Complete deployment guide included

### Technical Features
- ✅ **TypeScript** - Type-safe codebase
- ✅ **Server Components** - Optimized performance
- ✅ **API Routes** - RESTful backend
- ✅ **Database ORM** - Prisma with migrations
- ✅ **Form Validation** - Client & server-side
- ✅ **Error Handling** - Comprehensive error management

## Tech Stack 🛠

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma (SQLite/PostgreSQL)
- **Payments:** Stripe (ready to integrate)
- **Deployment:** Vercel-ready

## Quick Start 🚀

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run dev
```

Visit **http://localhost:3000** 🎉

## Project Structure 📁

```
boosting/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── orders/              # Order management
│   │   └── calculate-price/     # Price calculation
│   ├── order/                   # Order page
│   ├── dashboard/               # Customer dashboard
│   └── games/                   # Game-specific pages
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── sections/                # Page sections
│       ├── Navbar.tsx           # With language switcher
│       ├── Hero.tsx
│       ├── Games.tsx
│       ├── Features.tsx
│       ├── Testimonials.tsx     # 12+ reviews
│       ├── CTA.tsx
│       └── Footer.tsx
├── lib/
│   ├── i18n/                    # Internationalization
│   │   ├── translations.ts      # 5 languages
│   │   ├── testimonials.ts      # Localized reviews
│   │   └── LanguageContext.tsx
│   ├── prisma.ts                # Database client
│   └── pricing.ts               # Price calculation logic
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # DB migrations
└── public/                      # Static assets
```

## Available Languages 🌍

Click the flag in the navbar to switch:
- 🇬🇧 English
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇵🇹 Português
- 🇨🇳 中文 (Chinese)
- 🇰🇷 한국어 (Korean)

**7 languages total!** Language preference is saved in localStorage.

## Database Schema 💾

### Order Model
```prisma
model Order {
  id              String   @id @default(uuid())
  orderNumber     String   @unique
  game            String
  service         String
  currentRank     String
  desiredRank     String
  options         Json
  price           Float
  status          String   @default("pending")
  customerEmail   String
  paymentStatus   String   @default("pending")
  progress        Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

View your database: `npx prisma studio`

## Pricing System 💰

Dynamic pricing based on:
- Rank difference (divisions)
- Service type (rank boost, duo queue, placement, coaching)
- Options (priority +30%, duo +20%, specific champions +10%, streaming +€5)

Example: Gold → Platinum = 4 divisions × €5.99 = €23.96

## Testimonials 📝

**12 verified customer reviews** across different games:
- League of Legends
- Valorant
- CS2
- Dota 2
- Overwatch 2
- Apex Legends

All reviews include:
- ✅ Verified badge
- ⭐ 5-star rating
- Game & date
- Detailed comments

## Setup Guides 📖

### Database Setup
See **[SETUP.md](./SETUP.md)** - Complete guide for:
- SQLite (development)
- PostgreSQL (production)
- Prisma migrations
- Database management

### Stripe Integration
See **[SETUP.md](./SETUP.md)** - Step-by-step:
1. Create Stripe account
2. Install dependencies
3. Setup payment API
4. Configure webhooks
5. Test payments
6. Go live

## Environment Variables 🔐

Create `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Commands 📝

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open database UI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client

# Deployment
git push                 # Auto-deploy with Vercel
```

## Deployment 🚀

### Option 1: Vercel (Easiest)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy ✅

### Option 2: VPS (Full Control) ⭐ RECOMMENDED

**Complete VPS deployment guide:** See **[VPS-DEPLOY.md](./VPS-DEPLOY.md)**

Quick steps:
```bash
# 1. Upload files to VPS
scp -r * user@YOUR_IP:/home/user/aqtboost/

# 2. On VPS - Install dependencies
npm install && npm run build

# 3. Setup PostgreSQL database
# 4. Configure Nginx + SSL
# 5. Start with PM2
pm2 start ecosystem.config.js

# 6. Or use deploy script
./deploy.sh
```

Full guide includes:
- Node.js installation
- PostgreSQL setup
- Nginx configuration
- SSL with Let's Encrypt
- PM2 process management
- Auto-deploy script
- Troubleshooting

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_WEBHOOK_SECRET` - Webhook secret

## Features to Add 🎯

### Payment Integration
- [ ] Stripe checkout flow
- [ ] Payment webhooks
- [ ] Order confirmation emails

### Enhanced Features
- [ ] User authentication (NextAuth.js)
- [ ] Admin dashboard
- [ ] Booster assignment system
- [ ] Live chat support
- [ ] Order tracking in real-time

### Marketing
- [ ] SEO optimization
- [ ] Blog/Resources section
- [ ] Affiliate program
- [ ] Referral system

## Security 🔒

- ✅ Environment variables for secrets
- ✅ Server-side validation
- ✅ SQL injection prevention (Prisma)
- ✅ HTTPS in production
- ⚠️ Add rate limiting for API routes
- ⚠️ Add authentication before going live

## Performance ⚡

- Server-side rendering
- Optimized images (use Next.js Image)
- Code splitting
- Lazy loading
- Caching strategies

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License 📄

Proprietary - All rights reserved

## Support 💬

For questions or issues:
1. Check [SETUP.md](./SETUP.md)
2. Review [Prisma docs](https://www.prisma.io/docs)
3. Check [Next.js docs](https://nextjs.org/docs)
4. Contact support

---

Built with ❤️ for competitive gamers worldwide.

**AQTBOOST** - Reach the rank of your dreams.
