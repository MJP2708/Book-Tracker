"use client";

import { Navigation } from "@/components/Navigation";
import { discoveryCategories } from "@/lib/mock-data";
import { BookOpen, Flame, Target, Plus, Sparkles, Users, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DashboardStats = {
  booksRead: number;
  totalPages: number;
  readingStreak: number;
};

type LibraryEntry = {
  id: string;
  status: "unread" | "reading" | "finished";
  pagesRead: number | null;
  totalPages: number | null;
  book: {
    id: string;
    title: string;
    author: string | null;
    coverImage: string | null;
    description: string | null;
  };
};

type SearchBook = {
  id: string;
  title: string;
  author: string | null;
  coverImage: string | null;
  description: string | null;
};

type DiscoverySnapshot = {
  trendingDiscussions: Array<{ id: string; title: string; topic: string; score: number }>;
  trendingUsers: Array<{ email: string; name: string; score: number }>;
};

type Recommendation = { title: string; reason: string };

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({ booksRead: 0, totalPages: 0, readingStreak: 0 });
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const [discovery, setDiscovery] = useState<DiscoverySnapshot>({ trendingDiscussions: [], trendingUsers: [] });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const run = async () => {
      const [meRes, libraryRes, discoveryRes, aiRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/library"),
        fetch("/api/discovery"),
        fetch("/api/ai/recommendations?interests=business,productivity"),
      ]);

      if (meRes.ok) {
        const me = (await meRes.json()) as { stats: DashboardStats };
        setStats(me.stats);
      }
      if (libraryRes.ok) {
        const entries = (await libraryRes.json()) as LibraryEntry[];
        setLibrary(entries);
      }
      if (discoveryRes.ok) setDiscovery((await discoveryRes.json()) as DiscoverySnapshot);
      if (aiRes.ok) setRecommendations((await aiRes.json()) as Recommendation[]);
    };

    void run();
  }, [status]);

  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/books?query=${encodeURIComponent(search.trim())}`);
      if (res.ok) {
        setSearchResults((await res.json()) as SearchBook[]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const currentlyReading = useMemo(
    () => library.filter((entry) => entry.status === "reading").slice(0, 4),
    [library]
  );

  const addExistingBook = async (bookId: string, statusValue: "unread" | "reading" | "finished" = "unread") => {
    setBusyLabel(bookId);
    const res = await fetch("/api/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, status: statusValue }),
    });

    if (res.ok) {
      const [libraryRes, meRes] = await Promise.all([fetch("/api/library"), fetch("/api/me")]);
      if (libraryRes.ok) setLibrary((await libraryRes.json()) as LibraryEntry[]);
      if (meRes.ok) { const me = (await meRes.json()) as { stats: DashboardStats }; setStats(me.stats); }
    }
    setBusyLabel(null);
  };

  const addSuggested = async (book: {
    title: string;
    author: string;
    description: string;
    coverUrl: string;
  }) => {
    setBusyLabel(book.title);
    const createRes = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: book.coverUrl,
      }),
    });

    if (!createRes.ok) {
      setBusyLabel(null);
      return;
    }

    const created = (await createRes.json()) as { id: string };
    await addExistingBook(created.id, "unread");
    setBusyLabel(null);
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="glass-card">
              <p className="text-sm text-zinc-500">Total books read</p>
              <p className="display-title mt-2 text-3xl">{stats.booksRead}</p>
            </div>
            <div className="glass-card">
              <p className="text-sm text-zinc-500">Pages read</p>
              <p className="display-title mt-2 text-3xl">{stats.totalPages}</p>
            </div>
            <div className="glass-card">
              <p className="text-sm text-zinc-500">Reading streak</p>
              <p className="display-title mt-2 text-3xl">{stats.readingStreak} days</p>
            </div>
          </section>

          <section className="glass-card">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <p className="display-title text-2xl">Your current sprint</p>
                <p className="text-sm text-zinc-500">Pick one book and move it forward today.</p>
              </div>
              <Link href="/bookshelf" className="primary-btn">
                Open Bookshelf
              </Link>
            </div>

            {currentlyReading.length === 0 ? (
              <p className="text-sm text-zinc-500">No active book yet. Add one from a recommendation below.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {currentlyReading.map((entry) => {
                  const progress = entry.totalPages
                    ? Math.min(100, Math.round(((entry.pagesRead || 0) / entry.totalPages) * 100))
                    : 0;

                  return (
                    <Link
                      key={entry.id}
                      href={`/books/${entry.book.id}`}
                      className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <p className="font-semibold">{entry.book.title}</p>
                      <p className="text-xs text-zinc-500">{entry.book.author || "Unknown"}</p>
                      <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progress}%` }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section className="glass-card space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <p className="display-title text-xl">Quick Discover</p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books by title or author"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none ring-cyan-400 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {search.trim().length > 0 && searchResults.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {searchResults.slice(0, 6).map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-zinc-500">{book.author || "Unknown"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void addExistingBook(book.id)}
                      className="secondary-btn"
                      disabled={busyLabel === book.id}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {discoveryCategories.map((category) => (
            <section key={category.key} className="glass-card">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {category.key === "trending" ? (
                    <Flame className="h-5 w-5 text-orange-500" />
                  ) : category.key === "recommended" ? (
                    <BookOpen className="h-5 w-5 text-cyan-500" />
                  ) : (
                    <Target className="h-5 w-5 text-emerald-500" />
                  )}
                  <p className="display-title text-xl">{category.title}</p>
                </div>
              </div>

              <div className="scroll-row">
                {category.books.map((book) => (
                  <article
                    key={`${category.key}-${book.title}`}
                    className="min-w-[220px] rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div
                      className="mb-3 h-32 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${book.coverUrl})` }}
                    />
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-xs text-zinc-500">{book.author}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">{book.description}</p>
                    <button
                      type="button"
                      onClick={() => void addSuggested(book)}
                      className="primary-btn mt-3 w-full"
                      disabled={busyLabel === book.title}
                    >
                      {busyLabel === book.title ? "Adding..." : "Add to shelf"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-500" />
                <p className="display-title text-xl">AI Recommendations</p>
              </div>
              <div className="space-y-2 text-sm">
                {recommendations.map((item) => (
                  <div key={item.title} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-zinc-500">{item.reason}</p>
                  </div>
                ))}
                {recommendations.length === 0 && <p className="text-zinc-500">No recommendations yet.</p>}
              </div>
            </article>

            <article className="glass-card space-y-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <p className="display-title text-xl">Trending Readers</p>
                </div>
                <div className="space-y-2 text-sm">
                  {discovery.trendingUsers.slice(0, 5).map((user) => (
                    <p key={user.email} className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">{user.name} · score {user.score}</p>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  <p className="display-title text-xl">Hot Discussions</p>
                </div>
                <div className="space-y-2 text-sm">
                  {discovery.trendingDiscussions.slice(0, 5).map((thread) => (
                    <p key={thread.id} className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">#{thread.topic} · {thread.title}</p>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
