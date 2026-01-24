# 🔧 Troubleshooting Guide

Common issues and solutions for Bookshelf.

---

## 🚨 Installation & Setup Issues

### Issue: `npm install` fails with permission denied
```bash
# Solution: Use sudo (not ideal) or fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use nvm for Node.js management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Issue: "Cannot find module" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for yarn
rm -rf node_modules yarn.lock
yarn install
```

### Issue: Port 3000 already in use
```bash
# Kill process using port 3000
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

---

## 🗄️ Database Issues

### Issue: Connection refused to PostgreSQL
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check if PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Windows: Check Services in Control Panel

# Start PostgreSQL if stopped
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

### Issue: "database does not exist"
```
Error: database "book_tracker" does not exist
```

**Solution:**
```bash
# Create database manually
createdb book_tracker

# Or update DATABASE_URL to existing database
# .env.local: DATABASE_URL="postgresql://user:password@localhost:5432/existing_db"

# Then run migrations
npx prisma migrate dev --name init
```

### Issue: "NEXTAUTH_SECRET is not set"
```
Error: NextAuth secret is required
```

**Solution:**
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="your-generated-secret-here"

# Restart dev server
npm run dev
```

### Issue: Prisma migration fails
```
Error: migrations have not been applied
```

**Solutions:**
```bash
# Option 1: Reset database (WARNING: deletes data)
npx prisma migrate reset

# Option 2: Manually apply migration
npx prisma db push

# Option 3: Create new migration
npx prisma migrate dev --name fix_schema
```

### Issue: "Unique constraint failed"
```
Error: Unique constraint failed on the fields: userId_bookId
```

**Solution:**
```typescript
// Use upsert instead of create
const userBook = await prisma.userBook.upsert({
  where: { userId_bookId: { userId, bookId } },
  update: { status: "reading" },
  create: { userId, bookId, status: "reading" }
});
```

---

## 🔐 Authentication Issues

### Issue: Login fails with correct credentials
```
Error: Invalid email or password
```

**Check:**
```bash
# 1. Verify user exists in database
npx prisma studio

# 2. Check password hashing
# Make sure bcrypt is comparing correctly

# 3. Check NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# 4. Check session duration
# Increase if too short: session: { maxAge: 30 * 24 * 60 * 60 }
```

### Issue: Session not persisting
```
Error: Session lost on refresh
```

**Solutions:**
```typescript
// Check NextAuth config in lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // ...
});

// Make sure callbacks are set up
callbacks: {
  async jwt({ token, user }) {
    if (user) token.id = user.id;
    return token;
  },
  async session({ session, token }) {
    if (session.user) session.user.id = token.id;
    return session;
  },
}
```

### Issue: "Unauthorized" on all API calls
```
Error: Unauthorized access to API
```

**Check:**
```bash
# 1. User is logged in
useSession() returns valid session

# 2. NEXTAUTH_URL is correct
# .env.local: NEXTAUTH_URL="http://localhost:3000"

# 3. Cookies are enabled in browser

# 4. Session is passed to API
// Make sure fetch includes credentials:
fetch('/api/posts', {
  method: 'POST',
  credentials: 'include', // Include cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

---

## 🎨 UI & Styling Issues

### Issue: Styles not applying
```
Classes like btn-primary not showing
```

**Solutions:**
```bash
# 1. Check globals.css is imported
import "./globals.css" in layout.tsx

# 2. Rebuild Tailwind cache
npm run dev -- --clean

# 3. Check tailwind.config.ts includes app directory
content: ["./app/**/*.{js,ts,jsx,tsx}"]

# 4. Restart dev server
```

### Issue: Dark mode not working
```
Dark mode styles not applying
```

**Check in layout.tsx:**
```tsx
// Must use suppressHydrationWarning
<html lang="en" suppressHydrationWarning>
  <body className={`${playfair.variable} ${inter.variable}`}>
```

**And in lib/providers.tsx:**
```tsx
// SessionProvider must wrap children
<SessionProvider>
  {children}
</SessionProvider>
```

### Issue: Animations stuttering
```
Smooth animations not smooth
```

**Solutions:**
```css
/* Use will-change sparingly */
.animate-float {
  will-change: transform;
  animation: float 3s ease-in-out infinite;
}

/* Reduce animation count */
/* Only animate on hover, not constantly */
.hover-lift {
  transition: transform 300ms ease-out;
}
```

---

## 📱 Responsive Design Issues

### Issue: Mobile layout broken
```
Content overflowing on mobile
```

**Check:**
```tsx
// Ensure viewport meta tag in layout.tsx
export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1"
};

// Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Issue: Navigation not sticking on mobile
```
Header jumps around on mobile
```

**Solution:**
```tsx
// Add sticky positioning
<nav className="sticky top-0 z-50">
  {/* Navigation content */}
</nav>
```

---

## 🚀 Build & Deployment Issues

### Issue: Build fails with "Property does not exist"
```
Error: Property 'user' does not exist on type 'never'
```

**Solution:**
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"

# Or run type check
npx tsc --noEmit

# Fix type errors shown
```

### Issue: Build fails on Vercel
```
Error: Build step failed
```

**Solutions:**
```bash
# 1. Check Node version
node --version # Should be 18+

# 2. Run build locally first
npm run build

# 3. Check environment variables in Vercel dashboard
# DATABASE_URL must be set
# NEXTAUTH_SECRET must be set
# NEXTAUTH_URL must be your domain

# 4. Check logs
vercel logs
```

### Issue: Database migrations fail on deploy
```
Error: migration pending
```

**Solution:**
```bash
# Add build script to package.json
"scripts": {
  "build": "prisma migrate deploy && next build"
}

# Or use Vercel deployment hooks
```

---

## 🔗 API Issues

### Issue: "Method not allowed" on POST request
```
Error: 405 Method Not Allowed
```

**Check:**
```typescript
// Route file must export both GET and POST if needed
export async function GET() { ... }
export async function POST() { ... }

// Or use handler pattern
export const { GET, POST } = handlers;
```

### Issue: CORS errors (when frontend != backend)
```
Error: Access to XMLHttpRequest blocked by CORS
```

**Solution:**
```typescript
// In route handlers, set CORS headers
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  
  return response;
}

// Or use next.config.ts
export default {
  headers: [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" }
      ]
    }
  ]
}
```

### Issue: Request body not being parsed
```
Error: body is undefined
```

**Solution:**
```typescript
export async function POST(request: NextRequest) {
  // Check Content-Type header
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 400 }
    );
  }
  
  const body = await request.json();
  // Now body is available
}
```

---

## 📚 Component Issues

### Issue: Component not updating after data change
```
Data updated in database but UI doesn't reflect
```

**Solutions:**
```typescript
// 1. Use Server Actions with revalidateTag
import { revalidateTag } from "next/cache";

export async function updateBook(bookId, data) {
  await prisma.userBook.update({ ... });
  revalidateTag(`book-${bookId}`);
}

// 2. Use useCallback with dependency array
const handleLike = useCallback(() => {
  setLiked(!liked);
}, [liked]);

// 3. Force refresh
window.location.reload();
```

### Issue: Infinite loops in useEffect
```
Component renders infinitely
```

**Fix:**
```typescript
// Wrong - no dependency array
useEffect(() => {
  fetchData();
});

// Right - empty array for once
useEffect(() => {
  fetchData();
}, []);

// Right - specific dependencies
useEffect(() => {
  if (userId) {
    fetchUserBooks(userId);
  }
}, [userId]);
```

---

## 🧪 Testing Issues

### Issue: Tests fail with "Cannot find module"
```
Error: Cannot find module '@/components/...'
```

**Solution:**
```bash
# Add jest config
npm install --save-dev jest @testing-library/react

# Create jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
```

---

## 📊 Performance Issues

### Issue: Page loads slowly
```
Performance is poor
```

**Diagnose:**
```bash
# Check bundle size
npm install -g webpack-bundle-analyzer

# Check slow components
# Use React DevTools Profiler

# Check database queries
# Enable Prisma logging
PRISMA_CLIENT_LOG_LEVEL=debug npm run dev
```

**Optimize:**
```typescript
// 1. Use dynamic imports
const PostCard = dynamic(() => import('@/components/feed/PostCard'));

// 2. Memoize components
const PostCard = memo(({ post }) => { ... });

// 3. Lazy load images
<Image src={url} alt="..." priority={false} />

// 4. Optimize database queries
await prisma.post.findMany({
  select: { id: true, content: true }, // Only needed fields
  take: 10 // Limit results
});
```

### Issue: Database queries are slow
```
Posts/books take long to load
```

**Solutions:**
```typescript
// Add indexes to schema
model Post {
  @@index([userId, createdAt])
  @@index([bookId])
}

// Use select to fetch only needed fields
const posts = await prisma.post.findMany({
  select: {
    id: true,
    content: true,
    user: { select: { id: true, name: true } }
  }
});

// Use pagination
const posts = await prisma.post.findMany({
  take: 20,
  skip: 0,
  orderBy: { createdAt: "desc" }
});
```

---

## 💡 General Debugging Tips

### Enable Debug Logging
```typescript
// In .env.local
DEBUG=* npm run dev

// Or for specific module
DEBUG=prisma:* npm run dev
```

### Check Browser Console
```javascript
// Check for errors
console.error("Error:", error);

// Check session
fetch("/api/auth/session").then(r => r.json()).then(console.log);

// Check network requests
// Open DevTools → Network tab
```

### Use Prisma Studio
```bash
# Visual database browser
npx prisma studio

# View/edit records
# Run migrations
# Check relationships
```

### Check Logs
```bash
# Next.js build logs
npm run build 2>&1 | tee build.log

# Runtime logs
tail -f .next/logs/*.log
```

---

## 🆘 When All Else Fails

```bash
# 1. Clear all caches
rm -rf node_modules .next .prisma package-lock.json

# 2. Reinstall everything
npm install

# 3. Reset database
npx prisma migrate reset

# 4. Restart server
npm run dev

# 5. Clear browser cache
# Dev Tools → Application → Storage → Clear All

# 6. Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

---

## 📞 Getting Help

1. **Check error message** - Read it carefully, often very helpful
2. **Search GitHub issues** - Someone likely had same problem
3. **Check documentation** - Prisma, Next.js, NextAuth docs
4. **Ask AI** - Provide error message + code snippet
5. **Check code comments** - Project has helpful comments

---

**Most issues have simple solutions. Take your time debugging!** 🐛
