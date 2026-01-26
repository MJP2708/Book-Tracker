# 🚀 Quick Setup Guide - Bookshelf

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL if not already installed
# macOS: brew install postgresql
# Windows: Download from postgresql.org
# Linux: sudo apt-get install postgresql

# Start PostgreSQL server and create database
createdb book_tracker
```

#### Option B: Cloud Database (Recommended)
- Sign up at [Neon](https://neon.tech) (free PostgreSQL hosting)
- Create a new project and database
- Copy the connection string

### 3. Configure Environment Variables

Create `.env.local`:
```env
# Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/book_tracker"
# Or use cloud DB: DATABASE_URL="postgresql://user:password@aws-xxxx.neon.tech/book_tracker"

# NextAuth Configuration
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000"

# Optional: For future OAuth integration
# GITHUB_ID="your-github-app-id"
# GITHUB_SECRET="your-github-app-secret"
```

**To generate AUTH_SECRET:**
```bash
# macOS/Linux:
openssl rand -base64 32

# Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 4. Setup Database Schema

```bash
# Create tables from schema
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🧪 Test the Application

### Test Account
You can create a new account at `http://localhost:3000/auth/signup`

**Example:**
- Email: `test@example.com`
- Password: `SecurePassword123`

### Test Features
1. **Signup/Login**: Create account and sign in
2. **Dashboard**: View your reading stats
3. **Add Books**: Add books to your library
4. **Create Posts**: Share thoughts about books
5. **Social Feed**: View posts from other users
6. **Profile**: Edit your bio and view stats

## 📦 Production Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/book-tracker
git push -u origin main

# 2. Deploy to Vercel
# Go to vercel.com, connect GitHub repo, and deploy

# 3. Configure environment variables in Vercel dashboard:
# - DATABASE_URL (use managed database or Neon)
# - AUTH_SECRET
# - AUTH_URL (your Vercel domain)
```

### Deploy to Other Platforms

**Railway.app**
```bash
# Connect GitHub repo and deploy
# Set environment variables in dashboard
```

**Render.com**
```bash
# Similar process - connect GitHub and deploy
# PostgreSQL database included
```

**Self-Hosted (VPS)**
```bash
# Build application
npm run build

# Start production server
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name bookshelf
```

## 🔧 Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
# Test connection string in .env.local
# Run: npx prisma db push (if using existing DB)
```

### Issue: NextAuth secret not set
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
AUTH_SECRET="your-generated-secret"
```

### Issue: "Permission denied" on migrations
```bash
# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Then run migrations
npx prisma migrate dev --name init
```

### Issue: Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Customize Branding**
   - Update app name in `layout.tsx`
   - Change colors in `globals.css`
   - Update favicon in `public/`

2. **Add Book Data**
   - Integrate with Google Books API
   - Create book seeding script in `prisma/seed.ts`

3. **Enable More Features**
   - Email notifications
   - Reading challenges
   - Book recommendations

4. **Monitor & Analyze**
   - Setup Vercel Analytics
   - Monitor database with Prisma
   - Track user engagement

## 📖 Documentation

- [Architecture Guide](./README-ARCHITECTURE.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth Docs](https://next-auth.js.org/)
- [Next.js Docs](https://nextjs.org/docs)

## 🆘 Need Help?

1. Check the error message carefully
2. Search GitHub issues
3. Review code comments
4. Check documentation links above

## ✅ Deployment Checklist

Before going live:

- [ ] Set up production database
- [ ] Generate new AUTH_SECRET
- [ ] Update AUTH_URL to production domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure email (for future notifications)
- [ ] Add monitoring/error tracking
- [ ] Test all features in production
- [ ] Setup CI/CD pipeline

---

**You're all set! 🎉 Happy reading!**
