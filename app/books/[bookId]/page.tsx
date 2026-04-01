"use client";

import { Navigation } from "@/components/Navigation";
import { Bookmark, Highlighter, Save, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BookDetail = {
  id: string;
  title: string;
  author: string | null;
  coverImage: string | null;
  description: string | null;
  totalPages: number | null;
  userBook: {
    id: string;
    status: "unread" | "reading" | "finished";
    pagesRead: number | null;
    totalPages: number | null;
    progress: number;
    note: string;
    highlights: string[];
  } | null;
};

export default function BookDetailPage() {
  const { status } = useSession();
  const params = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [note, setNote] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [pagesRead, setPagesRead] = useState("0");
  const [totalPages, setTotalPages] = useState("0");
  const [shelf, setShelf] = useState<"unread" | "reading" | "finished">("unread");

  useEffect(() => {
    if (status === "loading" || !params?.bookId) return;

    const run = async () => {
      const response = await fetch(`/api/books/${params.bookId}`);
      if (!response.ok) return;

      const payload = (await response.json()) as BookDetail;
      setBook(payload);
      setNote(payload.userBook?.note || "");
      setHighlights(payload.userBook?.highlights || []);
      setPagesRead(String(payload.userBook?.pagesRead || 0));
      setTotalPages(String(payload.userBook?.totalPages || payload.totalPages || 0));
      setShelf(payload.userBook?.status || "unread");
    };

    void run();
  }, [status, params?.bookId]);

  const progress = useMemo(() => {
    const read = Number(pagesRead) || 0;
    const total = Number(totalPages) || 0;
    if (!total) return 0;
    return Math.min(100, Math.round((read / total) * 100));
  }, [pagesRead, totalPages]);

  const saveChanges = async () => {
    if (!book) return;
    if (status !== "authenticated") {
      window.location.href = `/auth/login?from=/books/${book.id}`;
      return;
    }

    const response = await fetch(`/api/books/${book.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: shelf,
        pagesRead: Number(pagesRead) || 0,
        totalPages: Number(totalPages) || null,
        note,
        highlights,
      }),
    });

    if (!response.ok) return;

    const refreshed = await fetch(`/api/books/${book.id}`);
    if (refreshed.ok) {
      const payload = (await refreshed.json()) as BookDetail;
      setBook(payload);
    }
  };

  if (!book) return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="glass-card h-fit">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={book.coverImage || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"}
                alt={`${book.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 280px"
                priority={false}
              />
            </div>
            <p className="display-title text-xl">{book.title}</p>
            <p className="text-sm text-zinc-500">{book.author || "Unknown"}</p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{book.description || "No description yet."}</p>
          </aside>

          <section className="space-y-4">
            <div className="glass-card">
              <p className="display-title mb-3 text-xl">Progress tracking</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={shelf}
                  onChange={(event) => setShelf(event.target.value as "unread" | "reading" | "finished")}
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value="reading">Currently Reading</option>
                  <option value="finished">Completed</option>
                  <option value="unread">Want to Read</option>
                </select>
                <input
                  value={pagesRead}
                  onChange={(event) => setPagesRead(event.target.value)}
                  type="number"
                  min="0"
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Pages read"
                />
                <input
                  value={totalPages}
                  onChange={(event) => setTotalPages(event.target.value)}
                  type="number"
                  min="0"
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Total pages"
                />
              </div>
              <div className="mt-4 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{progress}% completed</p>
            </div>

            <div className="glass-card">
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-cyan-500" />
                <p className="display-title text-xl">Notes</p>
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={6}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Write key takeaways from this book"
              />
            </div>

            <div className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <Highlighter className="h-4 w-4 text-orange-500" />
                <p className="display-title text-xl">Highlight key ideas</p>
              </div>
              <div className="mb-3 flex gap-2">
                <input
                  value={highlightInput}
                  onChange={(event) => setHighlightInput(event.target.value)}
                  placeholder="Add highlight"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = highlightInput.trim();
                    if (!value) return;
                    setHighlights((prev) => [...prev, value]);
                    setHighlightInput("");
                  }}
                  className="secondary-btn"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {highlights.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => setHighlights((prev) => prev.filter((_, i) => i !== index))}
                      className="ml-2 text-zinc-400 hover:text-rose-500"
                      aria-label="Remove highlight"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {highlights.length === 0 && <p className="text-xs text-zinc-500">No highlights yet.</p>}
              </div>
            </div>

            <button type="button" onClick={() => void saveChanges()} className="primary-btn">
              <Save className="h-4 w-4" />
              Save updates
            </button>
            {status !== "authenticated" && (
              <p className="text-sm text-zinc-500">Sign in to track progress, save notes, and keep highlights.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
