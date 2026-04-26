"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Search, Loader2, BookX } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebouncedValue } from "@/lib/bookshelf/use-debounced-value";
import { LoadingSkeleton } from "@/components/animations";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiscoverTab = "trending" | "for-you" | "new" | "classics";

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: string;
  tab: string;
  emoji: string;
  cover: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const discoverBooks: Book[] = [
  { id: 1, title: "Project Hail Mary", author: "Andy Weir", rating: 4.8, genre: "Sci-Fi", tab: "trending", emoji: "🚀", cover: "from-[var(--pur)] to-[var(--teal2)]" },
  { id: 2, title: "Thinking, Fast and Slow", author: "D. Kahneman", rating: 4.7, genre: "Non-Fiction", tab: "for-you", emoji: "🧠", cover: "from-[var(--gold)] to-[var(--rose)]" },
  { id: 3, title: "The Stranger", author: "Albert Camus", rating: 4.5, genre: "Philosophy", tab: "classics", emoji: "🪨", cover: "from-[var(--ink2)] to-[var(--pur)]" },
  { id: 4, title: "Atomic Habits", author: "James Clear", rating: 4.9, genre: "Self-Help", tab: "for-you", emoji: "⚡", cover: "from-[var(--grn)] to-[var(--teal)]" },
  { id: 5, title: "Dune", author: "Frank Herbert", rating: 4.8, genre: "Fiction", tab: "trending", emoji: "🏜️", cover: "from-[var(--rose)] to-[var(--pur)]" },
  { id: 6, title: "Intermezzo", author: "Sally Rooney", rating: 4.2, genre: "Fiction", tab: "new", emoji: "💫", cover: "from-[var(--teal2)] to-[var(--gold2)]" },
];

const GENRES = ["All", "Sci-Fi", "Non-Fiction", "Philosophy", "Fiction", "Self-Help"] as const;
const TABS = [
  ["trending", "Trending"],
  ["for-you", "For you"],
  ["new", "New releases"],
  ["classics", "Classics"],
] as const;

// ─── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookCard({ book }: { book: Book }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      className="premium-card p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover with hover-preview overlay */}
      <div
        className={`relative mb-3 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${book.cover} text-4xl`}
      >
        {book.emoji}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-black/65"
            >
              <span className="text-xs font-semibold text-white">★ {book.rating}</span>
              <span className="text-[10px] text-white/60">{book.genre}</span>
              <motion.button
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.07, duration: 0.15 }}
                className="mt-1 rounded-full bg-[var(--gold2)] px-3 py-1 text-[10px] font-semibold text-white"
              >
                + Add to shelf
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body — unchanged from original */}
      <p className="font-display text-xl">{book.title}</p>
      <p className="text-sm text-[var(--ink3)]">{book.author}</p>
      <p className="mt-2 text-sm text-[var(--gold)]">★ {book.rating}</p>
      <span className="mt-2 inline-flex rounded-full bg-[var(--bg2)] px-2 py-1 text-xs text-[var(--ink2)]">
        {book.genre}
      </span>
    </motion.article>
  );
}

function DiscoverSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="premium-card space-y-3 p-4">
          <LoadingSkeleton variant="card" className="mb-3 h-28 rounded-xl" />
          <LoadingSkeleton variant="line" className="h-5 w-3/4" />
          <LoadingSkeleton variant="text" className="w-1/2" />
          <LoadingSkeleton variant="text" className="w-1/4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-card p-10 text-center"
    >
      <BookX className="mx-auto mb-3 h-10 w-10 text-[var(--ink3)]" strokeWidth={1.4} />
      <p className="font-display text-xl text-[var(--ink)]">No books found</p>
      <p className="mt-1 text-sm text-[var(--ink3)]">
        Try adjusting your search or switching tabs.
      </p>
      <button onClick={onClear} className="premium-btn-primary mt-5 px-4 py-2 text-sm">
        Clear filters
      </button>
    </motion.section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [tab, setTab] = useState<DiscoverTab>("trending");

  const debouncedQuery = useDebouncedValue(query, 320);
  const isSearching = query !== debouncedQuery;

  const filtered = discoverBooks.filter((book) => {
    const matchesTab = book.tab === tab;
    const matchesGenre = genre === "All" || book.genre === genre;
    const q = debouncedQuery.toLowerCase();
    const matchesQuery = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    return matchesTab && matchesGenre && matchesQuery;
  });

  const clearFilters = () => {
    setQuery("");
    setGenre("All");
  };

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pt-6 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <section>
            <p className="font-display text-3xl">Discover</p>
            <p className="text-sm text-[var(--ink3)]">
              Find your next obsession from social and AI-powered discovery.
            </p>
          </section>

          {/* ── Search + genre chips ── */}
          <section className="premium-card p-4">
            {/* Input */}
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {isSearching ? (
                  <motion.span
                    key="spinner"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none absolute left-3 top-2.5"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--gold2)]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none absolute left-3 top-2.5"
                  >
                    <Search className="h-4 w-4 text-[var(--ink3)]" />
                  </motion.span>
                )}
              </AnimatePresence>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author, or keyword"
                className="w-full rounded-lg border border-[var(--gold2)] px-9 py-2 text-sm outline-none"
              />
            </div>

            {/* Genre chips — spring-animated active pill */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`relative rounded-full px-3 py-1 transition-colors duration-150 ${
                    genre === g
                      ? "text-[var(--gold)]"
                      : "border border-[var(--bg3)] text-[var(--ink2)]"
                  }`}
                >
                  {genre === g && (
                    <motion.span
                      layoutId="genre-active"
                      className="absolute inset-0 rounded-full border border-[var(--gold2)] bg-[var(--gold3)]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{g}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Tab pills — spring-animated active indicator ── */}
          <section className="flex flex-wrap gap-2 text-sm">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as DiscoverTab)}
                className={`relative rounded-full px-3 py-1 transition-colors duration-150 ${
                  tab === key ? "text-white" : "border border-[var(--bg3)] text-[var(--ink2)]"
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute inset-0 rounded-full bg-[var(--ink)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </section>

          {/* ── Results area ── */}
          <AnimatePresence mode="wait">

            {/* Loading skeletons while debouncing */}
            {isSearching && (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <DiscoverSkeletons />
              </motion.div>
            )}

            {/* Empty state */}
            {!isSearching && filtered.length === 0 && (
              <EmptyState key="empty" onClear={clearFilters} />
            )}

            {/* Staggered results grid */}
            {!isSearching && filtered.length > 0 && (
              <motion.section
                key={`${tab}__${genre}__${debouncedQuery}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </motion.section>
            )}

          </AnimatePresence>

        </div>
      </main>
    </>
  );
}
