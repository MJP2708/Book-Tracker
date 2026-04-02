"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ShelfTab = "reading" | "want" | "finished" | "dnf";

type ShelfBook = {
  id: number;
  title: string;
  author: string;
  status: ShelfTab;
  rating?: number;
  progress?: number;
  emoji: string;
  cover: string;
};

const booksSeed: ShelfBook[] = [
  { id: 1, title: "Project Hail Mary", author: "Andy Weir", status: "reading", progress: 61, emoji: "🚀", cover: "from-[var(--pur)] to-[var(--teal2)]" },
  { id: 2, title: "The Creative Act", author: "Rick Rubin", status: "reading", progress: 24, emoji: "🎧", cover: "from-[var(--teal)] to-[var(--grn)]" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", status: "want", emoji: "🧠", cover: "from-[var(--gold)] to-[var(--rose)]" },
  { id: 4, title: "Dune", author: "Frank Herbert", status: "want", emoji: "🏜️", cover: "from-[var(--rose)] to-[var(--pur)]" },
  { id: 5, title: "Deep Work", author: "Cal Newport", status: "finished", rating: 5, emoji: "🎯", cover: "from-[var(--teal2)] to-[var(--gold)]" },
  { id: 6, title: "Atomic Habits", author: "James Clear", status: "finished", rating: 4, emoji: "⚡", cover: "from-[var(--grn)] to-[var(--teal2)]" },
  { id: 7, title: "Infinite Jest", author: "D. F. Wallace", status: "dnf", emoji: "🌀", cover: "from-[var(--ink2)] to-[var(--ink3)]" },
];

const notesSeed = [
  { id: 1, emoji: "🚀", title: "Project Hail Mary", chapter: "Chapter 9", date: "Mar 28", text: "Grace finally embraces uncertainty as a strategy, not a weakness." },
  { id: 2, emoji: "🎯", title: "Deep Work", chapter: "Rule 2", date: "Mar 23", text: "Attention residue is real. context switching kills true depth." },
];

export default function ShelfPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<ShelfTab>("reading");
  const [formOpen, setFormOpen] = useState(false);
  const [books, setBooks] = useState(booksSeed);
  const [newBook, setNewBook] = useState({ title: "", author: "", status: "want" as ShelfTab, pages: "320" });

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const tabCounts = {
    reading: books.filter((b) => b.status === "reading").length,
    want: books.filter((b) => b.status === "want").length,
    finished: books.filter((b) => b.status === "finished").length,
    dnf: books.filter((b) => b.status === "dnf").length,
  };

  const visible = useMemo(() => books.filter((b) => b.status === tab), [books, tab]);

  const addBook = () => {
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    setBooks((prev) => [
      {
        id: Date.now(),
        title: newBook.title,
        author: newBook.author,
        status: newBook.status,
        progress: newBook.status === "reading" ? 8 : undefined,
        emoji: "📘",
        cover: "from-[var(--teal)] to-[var(--pur)]",
      },
      ...prev,
    ]);
    setNewBook({ title: "", author: "", status: "want", pages: "320" });
    setFormOpen(false);
  };

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-3xl">My Shelf</p>
              <p className="text-sm text-[var(--ink3)]">Organize, track, and revisit your reading life.</p>
            </div>
            <button className="premium-btn-primary" onClick={() => setFormOpen((v) => !v)}>+ Add book</button>
          </section>

          {formOpen && (
            <section className="premium-card p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={newBook.title} onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <input value={newBook.author} onChange={(e) => setNewBook((p) => ({ ...p, author: e.target.value }))} placeholder="Author" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <select value={newBook.status} onChange={(e) => setNewBook((p) => ({ ...p, status: e.target.value as ShelfTab }))} className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm">
                  <option value="reading">Reading</option><option value="want">Want to read</option><option value="finished">Finished</option><option value="dnf">Did not finish</option>
                </select>
                <input value={newBook.pages} onChange={(e) => setNewBook((p) => ({ ...p, pages: e.target.value }))} placeholder="Pages" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
              </div>
              <button className="premium-btn-primary mt-3" onClick={addBook}>Add</button>
            </section>
          )}

          <section className="flex flex-wrap gap-2 text-sm">
            {[
              ["reading", `Reading (${tabCounts.reading})`],
              ["want", `Want to read (${tabCounts.want})`],
              ["finished", `Finished (${tabCounts.finished})`],
              ["dnf", `Did not finish (${tabCounts.dnf})`],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as ShelfTab)} className={`rounded-full px-3 py-1 transition-all duration-[0.18s] ${tab === key ? "border border-[var(--gold2)] bg-[var(--gold3)] text-[var(--gold)]" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{label}</button>
            ))}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((book) => (
              <article key={book.id} className="premium-card p-4">
                <div className={`mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${book.cover} text-4xl`}>{book.emoji}</div>
                <p className="font-display text-xl">{book.title}</p>
                <p className="text-sm text-[var(--ink3)]">{book.author}</p>
                {tab === "reading" && (
                  <>
                    <div className="mt-3 h-2 rounded-full bg-[var(--bg3)]"><div className="h-full rounded-full bg-[var(--gold2)]" style={{ width: `${book.progress || 0}%` }} /></div>
                    <p className="mt-1 text-xs text-[var(--ink3)]">{book.progress || 0}% complete</p>
                  </>
                )}
                {tab === "finished" && <p className="mt-2 text-sm text-[var(--gold)]">{"★".repeat(book.rating || 0)}{"☆".repeat(5 - (book.rating || 0))}</p>}
                {tab !== "reading" && tab !== "finished" && (
                  <span className="mt-2 inline-flex rounded-full bg-[var(--bg2)] px-2 py-1 text-xs text-[var(--ink2)]">{tab === "want" ? "Want to read" : "Did not finish"}</span>
                )}
              </article>
            ))}
          </section>

          <section className="premium-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl">Reading Notes</p>
              <button className="text-sm text-[var(--gold2)] underline">Export PDF</button>
            </div>
            <div className="mt-3 space-y-2">
              {notesSeed.map((item) => (
                <article key={item.id} className="rounded-xl border border-[var(--bg3)] p-3">
                  <p className="text-sm text-[var(--ink2)]">{item.emoji} <span className="font-medium">{item.title}</span> • {item.chapter}</p>
                  <p className="mt-1 text-xs text-[var(--ink3)]">{item.date}</p>
                  <p className="mt-2 text-sm italic text-[var(--ink2)]">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
