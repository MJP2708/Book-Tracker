"use client";

import { Navigation } from "@/components/Navigation";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type KnowledgeItem = {
  entryId: string;
  bookId: string;
  bookTitle: string;
  notes: string;
  highlights: string[];
};

export default function KnowledgePage() {
  const { status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/knowledge/search?query=${encodeURIComponent(query)}`);
      if (res.ok) setItems((await res.json()) as KnowledgeItem[]);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, status]);

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <section className="glass-card">
            <p className="display-title text-2xl">Knowledge Search</p>
            <p className="text-sm text-zinc-500">Search across your notes and highlights.</p>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes, highlights, or books"
                className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </section>

          <section className="space-y-3">
            {items.map((item) => (
              <article key={item.entryId} className="glass-card">
                <p className="display-title text-xl">{item.bookTitle}</p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.notes || "No notes yet."}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.highlights.map((h, idx) => (
                    <span key={`${item.entryId}-${idx}`} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{h}</span>
                  ))}
                </div>
              </article>
            ))}
            {items.length === 0 && <div className="glass-card text-sm text-zinc-500">No knowledge items found.</div>}
          </section>
        </div>
      </main>
    </>
  );
}
