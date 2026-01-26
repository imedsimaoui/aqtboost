# Quick Start Guide - AQTBOOST

## What's New

The platform now has a complete authentication system with 3 user roles:
- **CUSTOMER** - Order and track boosting services
- **BOOSTER** - Claim orders and earn money
- **ADMIN** - Manage the entire platform

## Start the Application

```bash
# Make sure you're in the project directory
cd /Users/simaouiimed/boosting

# Start the development server
npm run dev
```

Visit: http://localhost:3000

## Create Your First Accounts

### 1. Create a Customer Account
1. Go to http://localhost:3000/auth/signup
2. Fill in the form:
   - Name: Test Customer
   - Email: customer@test.com
   - Password: test123
   - Account Type: **Customer**
3. Click "Create account"
4. You'll be redirected to the customer dashboard

### 2. Create a Booster Account
1. Open a new incognito/private window (or sign out)
2. Go to http://localhost:3000/auth/signup
3. Fill in the form:
   - Name: Test Booster
   - Email: booster@test.com
   - Password: test123
   - Account Type: **Booster**
4. Click "Create account"
5. You'll be redirected to the booster dashboard

### 3. Create an Admin Account
Since admin accounts shouldn't be publicly created, use Prisma Studio:

```bash
# Open Prisma Studio
npx prisma studio
```

1. Go to the `User` table
2. Click "Add record"
3. Fill in:
   - id: (auto-generated)
   - name: Admin
   - email: admin@aqtboost.com
   - password: Use a hashed password (see below)
   - role: ADMIN
4. Save

**To generate a hashed password:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(console.log)"
```

## Test the Complete Flow

### As Customer:

1. **Sign In**
   - Go to http://localhost:3000/auth/signin
   - Email: customer@test.com
   - Password: test123

2. **Create an Order**
   - Click "Order Now" in navbar
   - Select game (e.g., League of Legends)
   - Select service (e.g., Rank Boost)
   - Choose ranks (e.g., Gold IV → Platinum IV)
   - Add options if desired
   - Complete the form
   - See your order number (e.g., AQT-XXXXX)

3. **View Dashboard**
   - See order statistics
   - View recent orders
   - Track progress

4. **View All Orders**
   - Click "View All" or go to "My Orders"
   - See detailed order information
   - Track progress bars

5. **Use Chat Support**
   - Click the blue chat button (bottom right)
   - Send a message
   - Get auto-reply

### As Booster:

1. **Sign In**
   - Email: booster@test.com
   - Password: test123

2. **Find Available Orders**
   - Go to "Available Orders" in navbar
   - Browse unclaimed orders
   - See order details and prices

3. **Claim an Order**
   - Click "Claim Order" on any order
   - You'll be redirected to "My Boosts"
   - Order status changes to "in-progress"

4. **Update Progress**
   - On "My Boosts" page
   - Click "Update Progress"
   - Move the slider (0-100%)
   - Click "Update"
   - Order completes automatically at 100%

5. **Track Earnings**
   - See total boosts and active boosts
   - View your rating (starts at 5.0)

### As Admin:

1. **Sign In**
   - Email: admin@aqtboost.com
   - Password: admin123

2. **View All Orders**
   - Click "All Orders" in navbar
   - See every order in the platform
   - View customer, booster, status, progress
   - Delete orders if needed

3. **Manage Users**
   - Click "Users" in navbar
   - See all registered users
   - View roles and statistics
   - See booster ratings

4. **View Statistics**
   - Click "Statistics" in navbar
   - See total revenue
   - View completion rates
   - Check top boosters
   - Monitor platform health

## Key URLs

- **Homepage:** http://localhost:3000
- **Sign Up:** http://localhost:3000/auth/signup
- **Sign In:** http://localhost:3000/auth/signin
- **Create Order:** http://localhost:3000/order
- **Dashboard:** http://localhost:3000/dashboard
- **Customer Orders:** http://localhost:3000/dashboard/orders
- **Booster Available:** http://localhost:3000/dashboard/booster/available
- **Booster My Orders:** http://localhost:3000/dashboard/booster/my-orders
- **Admin Orders:** http://localhost:3000/dashboard/admin/orders
- **Admin Users:** http://localhost:3000/dashboard/admin/users
- **Admin Stats:** http://localhost:3000/dashboard/admin/stats

## Features Overview

### Customer Dashboard
- Order statistics (total, active, completed)
- Recent orders with progress tracking
- Quick create order button
- Chat support widget

### Booster Dashboard
- Boosting statistics (total, active, rating)
- Quick access to available orders
- Recent boosts preview
- Earnings tracking

### Admin Dashboard
- Platform-wide statistics
- Revenue tracking
- User management
- Order management
- Top boosters leaderboard

### Chat Support
- Floating chat widget (blue button bottom right)
- Send messages to support
- Message history
- Auto-reply (demo mode)

## Database Management

```bash
# View/edit database
npx prisma studio

# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (CAREFUL!)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Troubleshooting

### Can't sign in
- Make sure the password is correct
- Clear cookies and try again
- Check the database in Prisma Studio

### Orders not showing for booster
- Make sure the order has `paymentStatus = 'completed'`
- Check if order is already claimed
- Verify you're signed in as BOOSTER role

### Chat not working
- Check if you're signed in
- Look at browser console for errors (F12)
- Verify the chat API is working

### Database errors
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Check `.env` file has correct DATABASE_URL

## Next Steps

1. **Test all user flows** (customer, booster, admin)
2. **Integrate Stripe payments** (see SETUP.md)
3. **Add email notifications** (see SETUP.md)
4. **Deploy to VPS** (see VPS-DEPLOY.md)
5. **Go live!**

## Important Files

- `AUTH-GUIDE.md` - Complete authentication documentation
- `FEATURES.md` - All implemented features
- `SETUP.md` - Database and Stripe setup
- `VPS-DEPLOY.md` - Production deployment guide
- `README.md` - Project overview

## Support

For issues or questions:
1. Check the documentation files above
2. Review the code comments
3. Use Prisma Studio to inspect the database
4. Check the browser console for errors (F12)

---

**Happy boosting!** 🚀
