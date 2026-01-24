"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BookStatus = "unread" | "reading" | "finished";

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  totalPages?: number;
  pagesRead?: number;
  dateAdded: string;
}

const statusLabel: Record<BookStatus, string> = {
  unread: "Unread",
  reading: "In progress",
  finished: "Finished",
};

const statusStyles: Record<BookStatus, string> = {
  unread: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  reading:
    "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200 animate-float",
  finished:
    "bg-emerald-200 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
};

function normalizeStatus(status: string | undefined): BookStatus {
  const normalized = (status || "").toLowerCase().trim();
  if (
    normalized === "reading" ||
    normalized === "in progress" ||
    normalized === "on progress" ||
    normalized === "in-progress"
  ) {
    return "reading";
  }
  if (normalized === "finished" || normalized === "done") return "finished";
  return "unread";
}

function parseOptionalNumber(value: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("unread");
  const [totalPages, setTotalPages] = useState("");
  const [pagesRead, setPagesRead] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("books");
      if (!stored) return;
      const parsed = JSON.parse(stored) as Array<Partial<LibraryBook>>;
      const normalized = parsed
        .map((book) => {
          const normalizedStatus = normalizeStatus(book.status as string);
          const total = Number.isFinite(Number(book.totalPages))
            ? Number(book.totalPages)
            : undefined;
          const read = Number.isFinite(Number(book.pagesRead))
            ? Number(book.pagesRead)
            : undefined;
          return {
            id: book.id || Math.random().toString(),
            title: book.title || "Untitled",
            author: book.author || "Unknown author",
            status: normalizedStatus,
            totalPages: total,
            pagesRead: read,
            dateAdded:
              book.dateAdded ||
              new Date().toISOString().split("T")[0],
          } satisfies LibraryBook;
        })
        .filter((book) => book.title.trim().length > 0);
      setBooks(normalized);
    } catch (error) {
      console.error("Failed to load library:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (!title.trim()) return;
    const total = parseOptionalNumber(totalPages);
    const read = parseOptionalNumber(pagesRead);
    const nextStatus = status;
    const normalizedRead =
      nextStatus === "finished"
        ? total || read || 0
        : nextStatus === "reading"
        ? read || 0
        : 0;

    const newBook: LibraryBook = {
      id: Math.random().toString(),
      title: title.trim(),
      author: author.trim() || "Unknown author",
      status: nextStatus,
      totalPages: total,
      pagesRead: normalizedRead,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setBooks([newBook, ...books]);
    setTitle("");
    setAuthor("");
    setStatus("unread");
    setTotalPages("");
    setPagesRead("");
  };

  const updateBook = (id: string, updates: Partial<LibraryBook>) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== id) return book;
        const next = { ...book, ...updates };
        if (next.status === "finished" && next.totalPages) {
          next.pagesRead = next.totalPages;
        }
        if (next.status === "unread") {
          next.pagesRead = 0;
        }
        return next;
      })
    );
  };

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const unreadBooks = useMemo(
    () => books.filter((book) => book.status === "unread"),
    [books]
  );
  const readingBooks = useMemo(
    () => books.filter((book) => book.status === "reading"),
    [books]
  );
  const finishedBooks = useMemo(
    () => books.filter((book) => book.status === "finished"),
    [books]
  );

  const sections = [
    {
      key: "unread" as const,
      title: "Unread",
      description: "Books waiting on your shelf.",
      icon: BookOpen,
      items: unreadBooks,
    },
    {
      key: "reading" as const,
      title: "In progress",
      description: "What you are reading right now.",
      icon: Clock,
      items: readingBooks,
    },
    {
      key: "finished" as const,
      title: "Finished",
      description: "Completed reads and memories.",
      icon: CheckCircle2,
      items: finishedBooks,
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="font-serif-title text-amber-900 dark:text-amber-50">
                Your Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track unread books, progress, and finished reads in one place.
              </p>
            </div>
            <Link href="/wishlist" className="btn-secondary">
              Visit Wishlist
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add a book
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Input
                    placeholder="Book title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <Input
                    placeholder="Author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                  />
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as BookStatus)
                      }
                      className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                    >
                      <option value="unread">Unread</option>
                      <option value="reading">In progress</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Total pages"
                    value={totalPages}
                    onChange={(event) => setTotalPages(event.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Pages read"
                    value={pagesRead}
                    onChange={(event) => setPagesRead(event.target.value)}
                  />
                  <Button
                    onClick={addBook}
                    className="w-full font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    Add to library
                  </Button>
                </CardContent>
              </Card>

              <div className="card-bookish space-y-3">
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50">
                  Library overview
                </h3>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Total books</span>
                  <span className="font-semibold text-slate-900 dark:text-amber-50">
                    {books.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Unread</span>
                  <span className="font-semibold text-slate-900 dark:text-amber-50">
                    {unreadBooks.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>In progress</span>
                  <span className="font-semibold text-slate-900 dark:text-amber-50">
                    {readingBooks.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Finished</span>
                  <span className="font-semibold text-slate-900 dark:text-amber-50">
                    {finishedBooks.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.key} className="card-bookish">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {section.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {section.description}
                        </p>
                      </div>
                      <span className="badge">{section.items.length}</span>
                    </div>

                    {section.items.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No books yet. Add one to get started.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.map((book) => {
                          const progress =
                            book.pagesRead && book.totalPages
                              ? Math.min(
                                  100,
                                  Math.round(
                                    (book.pagesRead / book.totalPages) * 100
                                  )
                                )
                              : 0;

                          return (
                            <div
                              key={book.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-amber-50">
                                    {book.title}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {book.author}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeBook(book.id)}
                                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                  aria-label="Remove book"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full font-semibold ${statusStyles[book.status]}`}
                                >
                                  {statusLabel[book.status]}
                                </span>
                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  Added {book.dateAdded}
                                </span>
                              </div>

                              {book.status === "reading" && book.totalPages ? (
                                <div className="mt-4">
                                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                    <span>
                                      {book.pagesRead || 0} / {book.totalPages}
                                    </span>
                                    <span>{progress}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : null}

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-xs">
                                <select
                                  value={book.status}
                                  onChange={(event) =>
                                    updateBook(book.id, {
                                      status: event.target.value as BookStatus,
                                    })
                                  }
                                  className="h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm px-2"
                                >
                                  <option value="unread">Unread</option>
                                  <option value="reading">In progress</option>
                                  <option value="finished">Finished</option>
                                </select>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Pages read"
                                  value={book.pagesRead ?? ""}
                                  onChange={(event) =>
                                    updateBook(book.id, {
                                      pagesRead: parseOptionalNumber(
                                        event.target.value
                                      ),
                                    })
                                  }
                                  className="h-9"
                                />
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Total pages"
                                  value={book.totalPages ?? ""}
                                  onChange={(event) =>
                                    updateBook(book.id, {
                                      totalPages: parseOptionalNumber(
                                        event.target.value
                                      ),
                                    })
                                  }
                                  className="h-9"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
