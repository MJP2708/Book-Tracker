"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Search } from "lucide-react";
import { useState } from "react";

type DiscoverTab = "trending" | "for-you" | "new" | "classics";

const discoverBooks = [
  { id: 1, title: "Project Hail Mary", author: "Andy Weir", rating: 4.8, genre: "Sci-Fi", tab: "trending", emoji: "🚀", cover: "from-[var(--pur)] to-[var(--teal2)]" },
  { id: 2, title: "Thinking, Fast and Slow", author: "D. Kahneman", rating: 4.7, genre: "Non-Fiction", tab: "for-you", emoji: "🧠", cover: "from-[var(--gold)] to-[var(--rose)]" },
  { id: 3, title: "The Stranger", author: "Albert Camus", rating: 4.5, genre: "Philosophy", tab: "classics", emoji: "🪨", cover: "from-[var(--ink2)] to-[var(--pur)]" },
  { id: 4, title: "Atomic Habits", author: "James Clear", rating: 4.9, genre: "Self-Help", tab: "for-you", emoji: "⚡", cover: "from-[var(--grn)] to-[var(--teal)]" },
  { id: 5, title: "Dune", author: "Frank Herbert", rating: 4.8, genre: "Fiction", tab: "trending", emoji: "🏜️", cover: "from-[var(--rose)] to-[var(--pur)]" },
  { id: 6, title: "Intermezzo", author: "Sally Rooney", rating: 4.2, genre: "Fiction", tab: "new", emoji: "💫", cover: "from-[var(--teal2)] to-[var(--gold2)]" },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [tab, setTab] = useState<DiscoverTab>("trending");

  const filtered = discoverBooks.filter((book) => {
    const matchesTab = book.tab === tab;
    const matchesGenre = genre === "All" || book.genre === genre;
    const q = query.toLowerCase();
    const matchesQuery = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    return matchesTab && matchesGenre && matchesQuery;
  });

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pt-6 sm:px-6 lg:px-8">
          <section>
            <p className="font-display text-3xl">Discover</p>
            <p className="text-sm text-[var(--ink3)]">Find your next obsession from social and AI-powered discovery.</p>
          </section>

          <section className="premium-card p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--ink3)]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, author, or keyword" className="w-full rounded-lg border border-[var(--gold2)] px-9 py-2 text-sm outline-none" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["All", "Sci-Fi", "Non-Fiction", "Philosophy", "Fiction", "Self-Help"].map((g) => (
                <button key={g} onClick={() => setGenre(g)} className={`rounded-full px-3 py-1 ${genre === g ? "border border-[var(--gold2)] bg-[var(--gold3)] text-[var(--gold)]" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{g}</button>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap gap-2 text-sm">
            {[
              ["trending", "Trending"],
              ["for-you", "For you"],
              ["new", "New releases"],
              ["classics", "Classics"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as DiscoverTab)} className={`rounded-full px-3 py-1 ${tab === key ? "bg-[var(--ink)] text-white" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{label}</button>
            ))}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((book) => (
              <article key={book.id} className="premium-card p-4">
                <div className={`mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${book.cover} text-4xl`}>{book.emoji}</div>
                <p className="font-display text-xl">{book.title}</p>
                <p className="text-sm text-[var(--ink3)]">{book.author}</p>
                <p className="mt-2 text-sm text-[var(--gold)]">★ {book.rating}</p>
                <span className="mt-2 inline-flex rounded-full bg-[var(--bg2)] px-2 py-1 text-xs text-[var(--ink2)]">{book.genre}</span>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
