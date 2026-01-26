# Authentication & User Roles Guide

## Overview

The platform now has a complete authentication system with 3 user roles:
- **CUSTOMER**: Order boosting services
- **BOOSTER**: Provide boosting services and earn money
- **ADMIN**: Manage the entire platform

## Features Added

### 1. Authentication System
- NextAuth.js v5 with credentials provider
- Secure password hashing with bcryptjs
- JWT sessions
- Protected routes with middleware

### 2. User Registration & Login
- **Sign Up**: `/auth/signup`
  - Choose between Customer or Booster account
  - Automatic booster profile creation for boosters
- **Sign In**: `/auth/signin`
  - Email and password authentication
  - Remember me option

### 3. Customer Dashboard (`/dashboard`)
- View order statistics (total, active, completed)
- Recent orders list
- Quick access to create new orders
- Track order progress in real-time
- Chat support widget

### 4. Customer Orders Page (`/dashboard/orders`)
- View all orders
- See order details (game, ranks, booster, progress)
- Filter and track orders
- Payment status

### 5. Booster Dashboard (`/dashboard`)
- View boosting statistics (total boosts, active, rating)
- Quick actions to find orders
- Recent boosts list

### 6. Booster - Available Orders (`/dashboard/booster/available`)
- Browse all available orders (pending, not claimed)
- See order details and price
- One-click claim orders
- Filter by game, service type, options

### 7. Booster - My Orders (`/dashboard/booster/my-orders`)
- Manage active boosts
- Update progress (0-100%)
- See customer details
- Track earnings

### 8. Admin Dashboard (`/dashboard`)
- Quick links to all admin sections
- Platform overview

### 9. Admin - Orders (`/dashboard/admin/orders`)
- View ALL platform orders in table format
- See customer, booster, status, progress
- Delete orders
- Export data (coming soon)

### 10. Admin - Users (`/dashboard/admin/users`)
- View all users (customers, boosters, admins)
- See user statistics
- Booster ratings and performance
- User role management

### 11. Admin - Statistics (`/dashboard/admin/stats`)
- Total revenue
- Total orders and users
- Completion rate
- Order status breakdown
- User distribution (customers/boosters)
- Top boosters leaderboard
- Recent orders

### 12. Chat Support Widget
- Floating chat button on all dashboard pages
- Send messages to support
- Auto-reply for demo
- Real-time messaging ready (add Socket.io for live chat)

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  password      String
  role          Role      @default(CUSTOMER)  // CUSTOMER, BOOSTER, ADMIN

  orders        Order[]
  boosterProfile BoosterProfile?
  chatMessages  ChatMessage[]
}
```

### BoosterProfile Model
```prisma
model BoosterProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  games       Json
  rank        String
  rating      Float    @default(5.0)
  totalOrders Int      @default(0)
  isActive    Boolean  @default(true)

  user        User     @relation(fields: [userId], references: [id])
  orders      Order[]
}
```

### Order Model
```prisma
model Order {
  // ... existing fields
  userId          String?
  boosterId       String?

  user            User?           @relation(fields: [userId], references: [id])
  booster         BoosterProfile? @relation(fields: [boosterId], references: [id])
}
```

### ChatMessage Model
```prisma
model ChatMessage {
  id        String   @id @default(uuid())
  content   String
  orderId   String?
  userId    String
  isSupport Boolean  @default(false)

  order     Order?   @relation(fields: [orderId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers (signin, signout, session)

### Orders
- `POST /api/orders/[id]/claim` - Booster claims an order
- `PATCH /api/orders/[id]/progress` - Update order progress

### Admin
- `DELETE /api/admin/orders/[id]` - Delete an order

### Chat
- `GET /api/chat/messages` - Get user's messages
- `POST /api/chat/messages` - Send a message

## Quick Start

### 1. Run Migration
```bash
npx prisma migrate dev
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Create Test Accounts

#### Create Admin Account (via Prisma Studio)
```bash
npx prisma studio
```
Then manually create a user with `role = "ADMIN"`

Or use bcrypt to hash a password and insert directly:
```javascript
// In Node.js console
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('admin123', 10);
console.log(hash); // Use this in Prisma Studio
```

#### Create Customer Account
1. Go to http://localhost:3000/auth/signup
2. Fill form with role "Customer"
3. Sign in

#### Create Booster Account
1. Go to http://localhost:3000/auth/signup
2. Fill form with role "Booster"
3. Sign in

### 4. Test the Flow

**As Customer:**
1. Sign up → `/auth/signup` (role: Customer)
2. Create order → `/order`
3. View dashboard → `/dashboard`
4. Track orders → `/dashboard/orders`
5. Use chat support

**As Booster:**
1. Sign up → `/auth/signup` (role: Booster)
2. Find orders → `/dashboard/booster/available`
3. Claim order → Click "Claim Order"
4. Manage boosts → `/dashboard/booster/my-orders`
5. Update progress → Click "Update Progress"

**As Admin:**
1. Create admin user via Prisma Studio
2. Sign in → `/auth/signin`
3. View all orders → `/dashboard/admin/orders`
4. Manage users → `/dashboard/admin/users`
5. View stats → `/dashboard/admin/stats`

## Environment Variables

Add to `.env`:
```env
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT session tokens
- Protected routes with middleware
- Server-side session validation
- CSRF protection (built into NextAuth)
- SQL injection prevention (Prisma ORM)

## Next Steps

### Immediate Improvements
1. Add email verification
2. Add password reset flow
3. Add 2FA authentication
4. Add real-time chat with Socket.io
5. Add email notifications (order updates, assignments)

### Payment Integration
1. Complete Stripe integration (guide in SETUP.md)
2. Add payment webhooks
3. Mark orders as `paymentStatus: 'completed'` after payment
4. Only show paid orders to boosters

### Advanced Features
1. Add booster application/approval system
2. Add customer reviews for boosters
3. Add dispute resolution system
4. Add automatic booster assignment based on game/rank
5. Add booster availability calendar
6. Add streaming integration (Twitch/YouTube)
7. Add in-app notifications

## Troubleshooting

### "Unauthorized" Error
- Make sure you're signed in
- Check if JWT token is valid (clear cookies and sign in again)

### "Booster profile not found"
- Sign out and sign up again as Booster
- Check database: `npx prisma studio` → BoosterProfile table

### Can't claim orders
- Make sure order `paymentStatus = 'completed'`
- Make sure order `boosterId = null`
- Sign in as BOOSTER role user

### Chat not working
- Check if user is authenticated
- Check browser console for errors
- Verify API route `/api/chat/messages` is working

## Production Checklist

Before deploying to production:

- [ ] Change `NEXTAUTH_SECRET` to a strong random string
- [ ] Set `NEXTAUTH_URL` to your domain
- [ ] Use PostgreSQL instead of SQLite
- [ ] Add SSL/HTTPS
- [ ] Add rate limiting to auth endpoints
- [ ] Add email verification
- [ ] Add password strength requirements
- [ ] Add account lockout after failed attempts
- [ ] Add audit logs for admin actions
- [ ] Add data backup system
- [ ] Add GDPR compliance (data export, deletion)
- [ ] Test all user flows thoroughly

---

**AQTBOOST** - Professional rank boosting platform with complete user management.
