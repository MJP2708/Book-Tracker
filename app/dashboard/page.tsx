"use client";

import { Navigation } from "@/components/Navigation";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { PostCard } from "@/components/feed/PostCard";
import { BookX, UserPlus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FeedPost = {
  id: string;
  type: "post" | "repost" | "quote" | "progress_update";
  content?: string | null;
  createdAt: string;
  user: { id: string; name: string | null; avatar?: string | null };
  book?: { title: string; author: string | null; coverImage?: string | null } | null;
  _count: { likes: number; comments: number };
};

type UserBook = {
  id: string;
  status: string;
  rating?: number | null;
  pagesRead?: number | null;
  totalPages?: number | null;
  book: {
    title: string;
    author?: string | null;
  };
};

type SuggestionsUser = {
  id: string;
  name: string | null;
  favoriteGenre?: string | null;
};

export default function DashboardPage() {
  const [addedFriends, setAddedFriends] = useState<Record<string, boolean>>({});
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [recentBooks, setRecentBooks] = useState<UserBook[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestionsUser[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SuggestionsUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    booksRead: 0,
    totalPages: 0,
    readingStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const currentlyReading = recentBooks.filter(
    (book) => book.status === "reading"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      void loadDashboard();
    }
  }, [status, router]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [postsRes, booksRes, meRes, suggestionsRes] = await Promise.all([
        fetch("/api/posts?limit=3"),
        fetch("/api/library"),
        fetch("/api/me"),
        fetch("/api/users/suggestions"),
      ]);

      if (postsRes.ok) {
        const postData = (await postsRes.json()) as FeedPost[];
        setPosts(postData);
      }

      if (booksRes.ok) {
        const bookData = (await booksRes.json()) as UserBook[];
        setRecentBooks(bookData);
      }

      if (meRes.ok) {
        const meData = (await meRes.json()) as {
          stats: { booksRead: number; totalPages: number; readingStreak: number };
        };
        setStats(meData.stats);
      }

      if (suggestionsRes.ok) {
        const suggestionData = (await suggestionsRes.json()) as SuggestionsUser[];
        setSuggestedFriends(suggestionData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (data: { type: string; content: string }) => {
    const payload = {
      type: data.type === "progress" ? "progress_update" : data.type,
      content: data.content,
    };
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create post.");
    }
    const created = (await response.json()) as FeedPost;
    setPosts((prev) => [created, ...prev].slice(0, 3));
  };

  const handleToggleLike = async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { likeCount: number };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, _count: { ...post._count, likes: data.likeCount } }
          : post
      )
    );
  };

  const handleDeletePost = async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (!response.ok) {
      return;
    }
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleFollow = async (userId: string) => {
    const response = await fetch(`/api/users/${userId}/follow`, {
      method: "POST",
    });
    if (!response.ok) {
      return;
    }
    setAddedFriends((prev) => ({ ...prev, [userId]: true }));
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search users.");
      }
      const results = (await response.json()) as SuggestionsUser[];
      setSearchResults(results);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Failed to search users."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-title text-amber-900 dark:text-amber-50 mb-2">
              Welcome Back!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your reading, connect with other book lovers, and discover
              your next favorite read.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <CreatePostForm onPost={handleCreatePost} />

              {/* Sample Posts */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="card-bookish">Loading your updates...</div>
                ) : posts.length === 0 ? (
                  <div className="card-bookish">
                    No posts yet. Share your first update to start the
                    conversation.
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      author={{
                        id: post.user.id,
                        name: post.user.name ?? "Reader",
                        avatar: post.user.avatar ?? undefined,
                      }}
                      type={post.type}
                      book={
                        post.book
                          ? {
                              title: post.book.title,
                              author: post.book.author ?? "Unknown",
                              coverImage: post.book.coverImage ?? undefined,
                            }
                          : undefined
                      }
                      content={post.content ?? undefined}
                      createdAt={post.createdAt}
                      likes={post._count.likes}
                      comments={post._count.comments}
                      onLike={() => handleToggleLike(post.id)}
                      currentUserId={session?.user?.id}
                      onDelete={() => handleDeletePost(post.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Add Friends */}
              <div className="card-bookish mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50">
                    Add Friends
                  </h3>
                  <span className="badge">New</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Grow your circle and share shelves.
                  </p>
                </div>
                <form onSubmit={handleSearch} className="space-y-3 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Find friends by username"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    />
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                      disabled={searchLoading}
                    >
                      {searchLoading ? "Searching..." : "Find"}
                    </button>
                  </div>
                  {searchError && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {searchError}
                    </p>
                  )}
                </form>
                {searchResults.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {searchResults.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 dark:border-slate-700 p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-amber-50 truncate">
                            {friend.name ?? "Reader"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {friend.favoriteGenre ?? "Book lover"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={`btn-secondary px-3 py-2 text-sm gap-1 ${
                            addedFriends[friend.id]
                              ? "cursor-default opacity-80"
                              : ""
                          }`}
                          onClick={() => handleFollow(friend.id)}
                          disabled={addedFriends[friend.id]}
                        >
                          <UserPlus className="w-4 h-4" />
                          {addedFriends[friend.id] ? "Sent" : "Add"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {!searchLoading &&
                  searchQuery.trim().length > 0 &&
                  searchResults.length === 0 &&
                  !searchError && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      No users found for "{searchQuery.trim()}".
                    </p>
                  )}
                <div className="space-y-3">
                  {suggestedFriends.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No suggestions yet. Invite friends to join you.
                    </p>
                  ) : (
                    suggestedFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 dark:border-slate-700 p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-amber-50 truncate">
                            {friend.name ?? "Reader"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {friend.favoriteGenre ?? "Book lover"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={`btn-secondary px-3 py-2 text-sm gap-1 ${
                            addedFriends[friend.id]
                              ? "cursor-default opacity-80"
                              : ""
                          }`}
                          onClick={() => handleFollow(friend.id)}
                          disabled={addedFriends[friend.id]}
                        >
                          <UserPlus className="w-4 h-4" />
                          {addedFriends[friend.id] ? "Sent" : "Add"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reading Goals */}
              <div className="card-bookish mb-6">
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                  Currently Reading
                </h3>
                <div className="space-y-4">
                  {currentlyReading.length > 0 ? (
                    currentlyReading.map((book) => (
                      <div
                        key={book.id}
                        className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-amber-50 line-clamp-1">
                          {book.book.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {book.book.author ?? "Unknown"}
                        </p>
                        {book.status === "reading" && (
                          <>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              {book.pagesRead} / {book.totalPages} pages
                            </p>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                                style={{
                                  width: `${
                                    ((book.pagesRead || 0) /
                                      (book.totalPages || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <BookX className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        No books currently reading. Start one now!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="card-bookish">
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Books Read
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.booksRead}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Pages This Year
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.totalPages}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Reading Streak
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.readingStreak} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
