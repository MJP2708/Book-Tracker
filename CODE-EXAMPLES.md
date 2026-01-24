# 📚 Code Examples & Common Operations

Quick reference for implementing common features in Bookshelf.

## 🔐 Authentication

### Check if User is Logged In
```typescript
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not logged in</p>;
  
  return <p>Welcome {session.user.name}!</p>;
}
```

### Get Current User Server-Side
```typescript
import { getAuthenticatedUser } from "@/lib/server-actions";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  
  return <h1>{user.name}'s Profile</h1>;
}
```

### Logout
```typescript
import { signOut } from "next-auth/react";

<button onClick={() => signOut()}>Logout</button>
```

---

## 📚 Books & Library

### Get User's Books
```typescript
import { getUserBooks } from "@/lib/server-actions";

const books = await getUserBooks(userId);
books.forEach(book => {
  console.log(book.book.title, book.status);
});
```

### Add Book to Library
```typescript
const response = await fetch("/api/library", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bookId: "book-id",
    status: "reading",
    pagesRead: 150,
    totalPages: 350,
    rating: null,
    review: "Great book so far!"
  })
});

const userBook = await response.json();
```

### Update Reading Progress
```typescript
await fetch("/api/library", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bookId: "book-id",
    status: "reading",
    pagesRead: 200, // Updated
    totalPages: 350
  })
});
```

### Rate a Finished Book
```typescript
await fetch("/api/library", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bookId: "book-id",
    status: "finished",
    rating: 4,
    review: "Amazing book! Highly recommended."
  })
});
```

---

## 💬 Posts & Social

### Create a Post
```typescript
const response = await fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Just started reading 'The Midnight Library'! #cozy #fantasy",
    type: "post",
    bookId: "book-123"
  })
});

const post = await response.json();
```

### Create a Quote Post
```typescript
await fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: '"Between the pages of a book is a perfect place to be." - Unknown',
    type: "quote",
    bookId: "book-456"
  })
});
```

### Repost a Book
```typescript
await fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Everyone should read this book! 📚",
    type: "repost",
    bookId: "book-789"
  })
});
```

### Get Social Feed
```typescript
const response = await fetch("/api/posts?limit=20&skip=0");
const posts = await response.json();

posts.forEach(post => {
  console.log(post.user.name, post.content);
  console.log(`Likes: ${post._count.likes}`);
});
```

### Like a Post
```typescript
const response = await fetch(`/api/posts/post-id/like`, {
  method: "POST"
});

const { liked, likeCount } = await response.json();
console.log(`Liked: ${liked}, Total: ${likeCount}`);
```

### Fetch Posts with Pagination
```typescript
let skip = 0;
const limit = 20;

async function loadMorePosts() {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  const newPosts = await response.json();
  
  skip += limit;
  return newPosts;
}
```

---

## 🏷️ Tags & Mentions

### Parse Content for Tags
```typescript
import { parseContent, extractMentions, extractHashtags } from "@/lib/tag-parser";

const text = "Just finished @JaneAuthor's book! #dystopian #thought-provoking";

const parsed = parseContent(text);
console.log(parsed.tags); // Array of tags

const mentions = extractMentions(text); // ["JaneAuthor"]
const hashtags = extractHashtags(text); // ["dystopian", "thought-provoking"]
```

### Render Tagged Content
```typescript
import { TaggedContent } from "@/components/feed/TaggedContent";

<TaggedContent content="Just finished @JaneAuthor's book! #dystopian" />
```

---

## 👥 Social Connections

### Follow a User
```typescript
const response = await fetch("/api/users/user-id/follow", {
  method: "POST"
});

const { isFollowing } = await response.json();
```

### Get User Followers
```typescript
import { prisma } from "@/lib/prisma";

const followers = await prisma.follows.findMany({
  where: { followingId: userId },
  include: { follower: true }
});
```

### Get Users Following
```typescript
const following = await prisma.follows.findMany({
  where: { followerId: userId },
  include: { following: true }
});
```

---

## 📊 Statistics & Analytics

### Get Reading Stats
```typescript
import { getReadingStats } from "@/lib/server-actions";

const stats = await getReadingStats(userId);
console.log(stats.booksRead);
console.log(stats.totalPages);
console.log(stats.readingStreak);
```

### Calculate Progress Percentage
```typescript
function getProgress(pagesRead: number, totalPages: number) {
  return Math.round((pagesRead / totalPages) * 100);
}

const percent = getProgress(150, 350); // 43%
```

### Get User's Favorite Genre
```typescript
const books = await getUserBooks(userId);
const genres = books
  .filter(b => b.book.genre)
  .map(b => b.book.genre);

const favoriteGenre = getFrequent(genres);
```

---

## 🎨 UI Components

### Display Empty State
```typescript
import { EmptyState } from "@/components/EmptyState";

<EmptyState 
  type="no-books"
  action={{ label: "Add your first book", href: "/books" }}
/>
```

### Show Loading State
```typescript
import { SkeletonLoader } from "@/components/SkeletonLoader";

<SkeletonLoader type="post" count={3} />
```

### Post Card
```typescript
import { PostCard } from "@/components/feed/PostCard";

<PostCard
  id="post-1"
  author={{ id: "user-1", name: "Jane Doe" }}
  type="post"
  content="Just finished this amazing book!"
  createdAt={new Date()}
  likes={42}
  comments={5}
/>
```

### Book Card
```typescript
import { BookCard } from "@/components/books/BookCard";

<BookCard
  id="book-1"
  title="The Midnight Library"
  author="Matt Haig"
  status="reading"
  pagesRead={150}
  totalPages={288}
  rating={4}
/>
```

---

## 🔒 Protected API Routes

### Check Authentication
```typescript
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Your logic here
}
```

### Get Current User in API
```typescript
import { prisma } from "@/lib/prisma";

const user = await prisma.user.findUnique({
  where: { email: session.user.email },
  include: { readingStats: true }
});
```

---

## 🗃️ Database Queries

### Find User by ID
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    _count: {
      select: { books: true, followers: true, following: true }
    }
  }
});
```

### Get User's Posts with Relations
```typescript
const posts = await prisma.post.findMany({
  where: { userId },
  include: {
    user: true,
    book: true,
    _count: {
      select: { likes: true, comments: true }
    }
  },
  orderBy: { createdAt: "desc" },
  take: 10
});
```

### Create Post with Tags
```typescript
const mentions = extractMentions(content);
const user = await prisma.user.findUnique({
  where: { email: session.user.email }
});

const post = await prisma.post.create({
  data: {
    userId: user.id,
    content,
    type: "post",
    tags: {
      create: mentions.map(mention => ({
        mentionedUser: {
          connect: { name: mention } // Adjust based on your needs
        }
      }))
    }
  }
});
```

### Get Feed with Followers
```typescript
const feedPosts = await prisma.post.findMany({
  where: {
    user: {
      OR: [
        { id: currentUserId },
        { followers: { some: { followerId: currentUserId } } }
      ]
    }
  },
  include: { user: true, book: true },
  orderBy: { createdAt: "desc" },
  take: 20
});
```

---

## 🎯 Common Patterns

### Debounced Search
```typescript
import { useState, useCallback } from "react";

export function SearchBooks() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    }, 300),
    []
  );

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### Infinite Scroll
```typescript
import { useEffect, useRef } from "react";

export function InfiniteFeed() {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMorePosts();
      }
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [skip]);

  async function loadMorePosts() {
    const response = await fetch(`/api/posts?skip=${skip}&limit=20`);
    const newPosts = await response.json();
    setPosts([...posts, ...newPosts]);
    setSkip(skip + 20);
  }

  return (
    <>
      {posts.map(post => <PostCard key={post.id} {...post} />)}
      <div ref={observerTarget} />
    </>
  );
}
```

---

## 🚀 Quick Copy-Paste Templates

### New Page Template
```typescript
"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";

export default function NewPage() {
  const { data: session } = useSession();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-serif-title text-amber-900 dark:text-amber-50">
            Page Title
          </h1>
        </div>
      </main>
    </>
  );
}
```

### New API Route Template
```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    
    // Your logic here

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

**These examples cover 90% of common operations. Mix and match to build your features!**
