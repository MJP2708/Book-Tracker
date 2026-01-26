# 📚 Bookshelf - Modern Social Reading Platform

A production-ready Next.js application transforming book reading into a social, cloud-based experience. Share books, connect with readers, track progress, and discover your next favorite read.

## ✨ Features

### 🔐 Authentication & User Management
- **Email/Password Authentication** via NextAuth.js with bcrypt hashing
- **User Profiles** with avatar, bio, and reading statistics
- **Protected Routes** with session-based access control
- **Account Security** with secure JWT sessions

### 📚 Personal Library
- **Multi-Status Organization** (Unread, Reading, Finished)
- **Reading Progress Tracking** with page counters
- **Ratings & Reviews** for finished books
- **Custom Tags** and notes for personal categorization
- **Cloud Sync** across all devices

### 🌍 Social Features
- **Follow System** to build reading circles
- **Social Feed** showing friends' books and progress
- **Reposting** books you've discovered
- **Quote Sharing** with attribution to books
- **Progress Updates** to share reading milestones

### 🏷️ Tagging System
- **@Mentions** for tagging friends in posts (@username)
- **#Hashtags** for genres, themes, emotions (#dystopian, #cozy)
- **Smart Tag Parsing** with link generation
- **Tag Search** functionality

### 💬 Interactions
- **Like** posts from your community
- **Comment** on book discussions
- **Save** posts to read later
- **Share** books and quotes

### 📊 Reading Analytics
- **Personal Statistics** (books read, pages, genres)
- **Reading Streaks** to maintain motivation
- **Reading Goals** (monthly/yearly targets)
- **Genre Preferences** tracking

## 🏗️ Architecture

### Tech Stack
```
Frontend: Next.js 16, React 19, TypeScript
Styling: Tailwind CSS, Custom Design System
Database: PostgreSQL with Prisma ORM
Authentication: NextAuth.js v5
APIs: REST endpoints with Server Actions
Icons: Lucide React
```

### Key Design Decisions

#### 1. **Server-First Architecture**
- Server Actions for data mutations
- API routes for complex operations
- Reduces client-side complexity
- Better security with server-side validation

#### 2. **Bookish Design System**
- **Typography**: Playfair Display (serif) for titles, Inter (sans-serif) for UI
- **Color Palette**: Warm ambers, golds, and slates
- **Textures**: Subtle paper textures for card elements
- **Animations**: Smooth micro-interactions (hover effects, transitions)
- **Dark Mode**: Reading-optimized color contrasts

#### 3. **Database Schema**
```
Users → Books (library management)
Users → Posts (social content)
Posts → Likes, Comments, Saves
Users → Follows (social connections)
Posts → Tags (mentions & hashtags)
Users → ReadingStats (analytics)
```

#### 4. **Security Practices**
- Passwords hashed with bcrypt
- JWT session tokens
- Protected API routes
- Rate limiting ready
- SQL injection prevention (Prisma)

## 📁 Project Structure

```
book-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   └── [...nextauth]/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [postId]/like/route.ts
│   │   ├── library/route.ts
│   │   └── users/[userId]/follow/route.ts
│   ├── dashboard/page.tsx
│   ├── feed/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx (landing)
├── components/
│   ├── Navigation.tsx
│   ├── feed/
│   │   ├── PostCard.tsx
│   │   ├── CreatePostForm.tsx
│   │   └── TaggedContent.tsx
│   ├── books/
│   │   └── BookCard.tsx
│   └── ui/
├── lib/
│   ├── auth.ts (NextAuth configuration)
│   ├── prisma.ts (Database client)
│   ├── providers.tsx (React providers)
│   ├── server-actions.ts (Server functions)
│   └── tag-parser.ts (Tag utilities)
├── prisma/
│   └── schema.prisma (Database schema)
├── .env.local (Environment variables)
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install**
```bash
cd book-tracker
npm install
```

2. **Setup database**
```bash
# Update .env.local with your PostgreSQL URL
# DATABASE_URL="postgresql://user:password@localhost:5432/book_tracker"

# Run migrations
npx prisma migrate dev --name init
npx prisma db seed # Optional: seed sample data
```

3. **Generate secrets**
```bash
# Generate NextAuth secret
openssl rand -base64 32
# Add to .env.local as AUTH_SECRET
```

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Configuration

### Environment Variables (.env.local)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/book_tracker"

# NextAuth
AUTH_SECRET="your-generated-secret-here"
AUTH_URL="http://localhost:3000"

# Optional: OAuth providers
# GITHUB_ID="your-github-id"
# GITHUB_SECRET="your-github-secret"
```

## 📖 Core Components & APIs

### Pages

#### `/auth/login` & `/auth/signup`
User authentication with email/password. Credentials validated against hashed database passwords.

#### `/dashboard`
Personalized homepage showing:
- Currently reading books with progress
- Recent activity
- Reading statistics
- Goal progress

#### `/feed`
Social feed featuring:
- Posts from followed users
- Book reposts
- Quote shares
- Like/comment interface

#### `/profile`
User profile displaying:
- User bio and avatar
- Reading statistics
- Reading history
- Recent activity timeline

### API Routes

#### `POST /api/auth/signup`
Creates new user account with hashed password.

#### `POST /api/posts`
Creates new post (regular, repost, or quote).

#### `POST /api/posts/[postId]/like`
Toggle like on a post.

#### `POST /api/library`
Add/update book in user's library.

#### `POST /api/users/[userId]/follow`
Toggle follow relationship.

## 🎨 Styling & UX

### Design System Classes

#### Typography
```tsx
<h1 className="font-serif-title"> // Playfair Display, bold
<h2 className="font-serif-subtitle"> // Playfair Display, semibold
```

#### Cards
```tsx
<div className="card-bookish"> // Paper texture, shadows, dark mode
```

#### Buttons
```tsx
<button className="btn-primary"> // Gradient amber-to-orange
<button className="btn-secondary"> // Border-based secondary
```

#### Animations
```tsx
className="animate-slideIn" // Fade in from top
className="hover-lift" // Hover elevate effect
className="animate-float" // Subtle floating
```

### Color Palette
- **Primary**: Amber 500/600 (warm, inviting)
- **Secondary**: Blue 500/600 (accents)
- **Success**: Green (finished status)
- **Accent**: Orange (highlights)
- **Dark Mode**: Slate 900 with amber accents

## 🔌 Extending Features

### Add Book Search
```typescript
// lib/book-search.ts
export async function searchBooks(query: string) {
  // Integrate with Google Books API or similar
}
```

### Add Notifications
```typescript
// Add Notification model to schema
// Send email/push notifications on interactions
```

### Add Reading Challenges
```typescript
// Create Challenge model
// Track user progress in monthly/yearly challenges
```

### Add Social Messaging
```typescript
// Add Message model for DMs
// Implement real-time updates with WebSocket
```

## 📊 Database Schema Highlights

### Key Relationships
```prisma
User (1) -->> (Many) Post
User (1) -->> (Many) Book via UserBook
User (Many) <<-->> (Many) User via Follows
Post (1) -->> (Many) Like
Post (1) -->> (Many) Comment
Book (1) -->> (Many) Quote
Post (Many) <<-->> (Many) User via TagMention
```

### Indexes for Performance
```prisma
@@index([userId, status]) // Fast book queries
@@index([postId, createdAt]) // Fast comment queries
@@fulltext([title, author]) // Book search
```

## 🧪 Testing & Deployment

### Development
```bash
npm run dev # Hot reload
```

### Build
```bash
npm run build
npm start
```

### Testing
```bash
# Add Jest + React Testing Library
npm install --save-dev jest @testing-library/react
```

### Deployment (Vercel)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set environment variables in Vercel dashboard
```

## 🔒 Security Checklist

- [x] Password hashing with bcrypt
- [x] JWT session tokens
- [x] Protected API routes with auth
- [x] CSRF protection (NextAuth built-in)
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React escaping)
- [ ] Rate limiting (add express-rate-limit)
- [ ] Input validation (add zod)
- [ ] HTTPS enforcement (production only)

## 📈 Performance Optimizations

- Server-side rendering for public pages
- Image optimization with Next.js Image
- Database query optimization with Prisma select
- Caching strategies for feed pagination
- Lazy loading for components

## 🐛 Known Issues & TODOs

### TODO
- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Book cover image uploads
- [ ] Full-text search implementation
- [ ] Reading notifications
- [ ] Export reading data (CSV)
- [ ] Mobile app (React Native)

### Future Enhancements
- Recommendations engine
- Book club features
- Virtual bookshelves
- Reading challenges
- Author interactions
- Publisher partnerships

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review code comments
3. Check GitHub issues
4. Start a discussion

## 📄 License

MIT License - Free to use and modify for personal/commercial projects.

---

## Quick Reference

### Common Tasks

**Create a new user**
```tsx
// Signup handles this via POST /api/auth/signup
```

**Add book to library**
```tsx
const response = await fetch('/api/library', {
  method: 'POST',
  body: JSON.stringify({
    bookId: 'abc123',
    status: 'reading',
    pagesRead: 150,
    totalPages: 350
  })
});
```

**Create a post**
```tsx
const response = await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({
    content: 'Just started reading #BookTitle by @Author',
    type: 'post',
    bookId: 'abc123'
  })
});
```

**Like a post**
```tsx
const response = await fetch(`/api/posts/${postId}/like`, {
  method: 'POST'
});
```

---

**Happy Reading! 📚**
