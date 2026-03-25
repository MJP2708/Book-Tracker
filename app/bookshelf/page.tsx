"use client";

import { Navigation } from "@/components/Navigation";
import { GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ShelfStatus = "reading" | "finished" | "unread";

type LibraryEntry = {
  id: string;
  status: ShelfStatus;
  pagesRead: number | null;
  totalPages: number | null;
  tags: string[];
  book: {
    id: string;
    title: string;
    author: string | null;
    coverImage: string | null;
    description: string | null;
  };
};

const shelfConfig: Record<ShelfStatus, { title: string; subtitle: string }> = {
  reading: { title: "Currently Reading", subtitle: "Books in progress" },
  finished: { title: "Completed", subtitle: "Finished titles" },
  unread: { title: "Want to Read", subtitle: "Your upcoming queue" },
};

export default function BookshelfPage() {
  const { status } = useSession();
  const router = useRouter();

  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    coverImage: "",
    description: "",
    totalPages: "",
    tags: "",
    shelf: "unread" as ShelfStatus,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const loadEntries = async () => {
    const res = await fetch("/api/library");
    if (res.ok) {
      setEntries((await res.json()) as LibraryEntry[]);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    let isMounted = true;

    fetch("/api/library")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: LibraryEntry[]) => {
        if (isMounted) {
          setEntries(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEntries([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [status]);

  const addBook = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setIsSaving(true);
    const bookRes = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        author: form.author,
        coverImage: form.coverImage,
        description: form.description,
        totalPages: Number(form.totalPages) || null,
        genre: form.tags,
      }),
    });

    if (bookRes.ok) {
      const created = (await bookRes.json()) as { id: string };
      await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: created.id,
          status: form.shelf,
          totalPages: Number(form.totalPages) || undefined,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        }),
      });
      await loadEntries();
      setForm({
        title: "",
        author: "",
        coverImage: "",
        description: "",
        totalPages: "",
        tags: "",
        shelf: "unread",
      });
    }
    setIsSaving(false);
  };

  const moveToShelf = async (entryId: string, nextStatus: ShelfStatus) => {
    await fetch(`/api/library/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, status: nextStatus } : entry)));
  };

  const deleteEntry = async (entryId: string) => {
    await fetch(`/api/library/${entryId}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter((entry) => {
      return (
        entry.book.title.toLowerCase().includes(query) ||
        (entry.book.author || "").toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [entries, search]);

  const shelves = {
    reading: filtered.filter((entry) => entry.status === "reading"),
    finished: filtered.filter((entry) => entry.status === "finished"),
    unread: filtered.filter((entry) => entry.status === "unread"),
  };

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
          <aside className="glass-card h-fit">
            <p className="display-title text-xl">Add a book</p>
            <p className="mb-4 text-sm text-zinc-500">Create books and place them on a shelf.</p>
            <form onSubmit={addBook} className="space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                required
              />
              <input
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Author"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={form.coverImage}
                onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                placeholder="Cover image URL"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                rows={3}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={form.totalPages}
                onChange={(e) => setForm((prev) => ({ ...prev, totalPages: e.target.value }))}
                type="number"
                min="0"
                placeholder="Total pages"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Tags (business, psychology)"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <select
                value={form.shelf}
                onChange={(e) => setForm((prev) => ({ ...prev, shelf: e.target.value as ShelfStatus }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="reading">Currently Reading</option>
                <option value="finished">Completed</option>
                <option value="unread">Want to Read</option>
              </select>
              <button type="submit" className="primary-btn w-full" disabled={isSaving}>
                <Plus className="h-4 w-4" />
                {isSaving ? "Saving..." : "Add to shelf"}
              </button>
            </form>
          </aside>

          <section className="space-y-4">
            <div className="glass-card">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, author, or tag"
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {(Object.keys(shelfConfig) as ShelfStatus[]).map((statusKey) => (
                <article
                  key={statusKey}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const entryId = event.dataTransfer.getData("text/plain");
                    if (entryId) {
                      void moveToShelf(entryId, statusKey);
                    }
                  }}
                  className="glass-card min-h-[220px]"
                >
                  <div className="mb-3">
                    <p className="display-title text-lg">{shelfConfig[statusKey].title}</p>
                    <p className="text-xs text-zinc-500">{shelfConfig[statusKey].subtitle}</p>
                  </div>

                  <div className="space-y-3">
                    {shelves[statusKey].map((entry) => {
                      const progress = entry.totalPages
                        ? Math.min(100, Math.round(((entry.pagesRead || 0) / entry.totalPages) * 100))
                        : 0;

                      return (
                        <div
                          key={entry.id}
                          draggable
                          onDragStart={(event) => {
                            setDraggingId(entry.id);
                            event.dataTransfer.setData("text/plain", entry.id);
                          }}
                          onDragEnd={() => setDraggingId(null)}
                          className={`rounded-xl border border-zinc-200 bg-white p-3 transition dark:border-zinc-800 dark:bg-zinc-900 ${
                            draggingId === entry.id ? "opacity-60" : ""
                          }`}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <Link href={`/books/${entry.book.id}`} className="font-semibold hover:text-cyan-600">
                                {entry.book.title}
                              </Link>
                              <p className="text-xs text-zinc-500">{entry.book.author || "Unknown"}</p>
                            </div>
                            <GripVertical className="h-4 w-4 text-zinc-400" />
                          </div>

                          {statusKey === "reading" && (
                            <div className="mb-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progress}%` }} />
                            </div>
                          )}

                          {entry.tags.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={`${entry.id}-${tag}`}
                                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between gap-2">
                            <select
                              value={entry.status}
                              onChange={(event) => void moveToShelf(entry.id, event.target.value as ShelfStatus)}
                              className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                            >
                              <option value="reading">Currently Reading</option>
                              <option value="finished">Completed</option>
                              <option value="unread">Want to Read</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => void deleteEntry(entry.id)}
                              className="secondary-btn px-3"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {shelves[statusKey].length === 0 && (
                      <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
                        Drop a book card here.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
