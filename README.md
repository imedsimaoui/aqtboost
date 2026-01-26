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
- ✅ **Authentication System** - NextAuth v5 with role-based access (Customer/Booster/Admin)
- ✅ **Booster Application System** - Application form with admin review panel
- ✅ **Admin Dashboard** - Manage users, orders, and booster applications
- ✅ **Chat Support Widget** - Integrated customer support
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✅ **SEO Optimized** - Meta tags, semantic HTML
- ✅ **VPS Ready** - Complete deployment guide for port 3002 included

### Technical Features
- ✅ **TypeScript** - Type-safe codebase
- ✅ **Server Components** - Optimized performance
- ✅ **API Routes** - RESTful backend
- ✅ **Database ORM** - Prisma with migrations
- ✅ **Authentication** - NextAuth v5 with JWT sessions
- ✅ **Password Hashing** - bcryptjs for secure passwords
- ✅ **Role-Based Access Control** - Customer, Booster, Admin roles
- ✅ **Form Validation** - Client & server-side
- ✅ **Error Handling** - Comprehensive error management

## Tech Stack 🛠

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 3.4
- **Database:** Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication:** NextAuth v5
- **Payments:** Stripe (ready to integrate)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **Deployment:** VPS-ready (Port 3002)

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

### User Model
```prisma
model User {
  id              String    @id @default(uuid())
  name            String?
  email           String    @unique
  password        String
  role            Role      @default(CUSTOMER)  // CUSTOMER, BOOSTER, ADMIN
  discord         String?
  orders          Order[]
  boosterProfile  BoosterProfile?
}
```

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
  customerId      String?
  boosterId       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Booster Application Model
```prisma
model BoosterApplication {
  id           String   @id @default(uuid())
  name         String
  email        String
  discord      String
  age          Int
  games        Json
  ranks        String
  experience   String
  availability String
  why          String
  status       String   @default("pending")  // pending, approved, rejected
  reviewedBy   String?
  reviewedAt   DateTime?
  notes        String?
  createdAt    DateTime @default(now())
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
DATABASE_URL="file:./dev.db"  # For development
# DATABASE_URL="postgresql://user:password@localhost:5432/aqtboost"  # For production

# Authentication
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Production (VPS)
# PORT=3002
# NEXTAUTH_URL="http://51.75.251.155:3002"

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV="development"
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

### Option 1: VPS Deployment (Port 3002) ⭐ RECOMMENDED

**For VPS with multiple sites already running.**

**Quick Start Guide:** See **[QUICK-START-VPS.md](./QUICK-START-VPS.md)**

**One-command setup:**
```bash
# On VPS (after uploading code)
cd ~/aqtboost
./setup-port-3002.sh
```

This automated script will:
- ✅ Configure port 3002
- ✅ Open firewall
- ✅ Install dependencies
- ✅ Setup database
- ✅ Build application
- ✅ Start with PM2

**Access your site:** http://51.75.251.155:3002

**Complete Guides:**
- **[DEPLOY-OVH.md](./DEPLOY-OVH.md)** - Full VPS deployment guide
- **[MULTI-SITE-NGINX.md](./MULTI-SITE-NGINX.md)** - Multi-site configuration
- **[check-vps.sh](./check-vps.sh)** - VPS diagnostic script

### Option 2: Vercel (Quick Testing)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy ✅

**Note:** For production with authentication and database, VPS is recommended.

### Production Environment Variables (VPS)
```env
DATABASE_URL="postgresql://aqtboost_user:PASSWORD@localhost:5432/aqtboost"
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://51.75.251.155:3002"
NODE_ENV="production"
PORT=3002
```

## Current Features ✅

### Authentication & Authorization
- ✅ User registration (Customers only)
- ✅ Booster application system with review
- ✅ Role-based access (CUSTOMER, BOOSTER, ADMIN)
- ✅ NextAuth v5 with JWT sessions
- ✅ Admin dashboard for user/order management

### Features to Add 🎯

### Payment Integration
- [ ] Stripe checkout flow
- [ ] Payment webhooks
- [ ] Order confirmation emails

### Enhanced Features
- [ ] Booster assignment automation
- [ ] Real-time order tracking
- [ ] Email notifications (Resend)
- [ ] Advanced analytics dashboard

### Marketing
- [ ] SEO optimization enhancements
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
