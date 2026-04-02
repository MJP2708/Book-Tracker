"use client";

import { useMemo, useState } from "react";
import type { Book, BookRecommendation } from "@/types/bookshelf";
import { BookCard } from "@/components/bookshelf/BookCard";

type DiscoverTabsProps = {
  trending: Book[];
  forYou: BookRecommendation[];
  newReleases: Book[];
  classics: Book[];
};

type TabKey = "trending" | "for_you" | "new_releases" | "classics";

const tabLabels: Record<TabKey, string> = {
  trending: "Trending",
  for_you: "For You",
  new_releases: "New Releases",
  classics: "Classics",
};

export function DiscoverTabs({ trending, forYou, newReleases, classics }: DiscoverTabsProps) {
  const [active, setActive] = useState<TabKey>("trending");

  const items = useMemo<Array<{ book: Book; reason?: string }>>(() => {
    if (active === "for_you") {
      return forYou.map((entry) => ({ book: entry.book, reason: entry.reason }));
    }

    const source = active === "trending" ? trending : active === "new_releases" ? newReleases : classics;
    return source.map((book) => ({ book }));
  }, [active, trending, forYou, newReleases, classics]);

  return (
    <section className="glass-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="display-title text-2xl">Discover</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">Curated shelves for every reading intent.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(Object.keys(tabLabels) as TabKey[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                active === tab
                  ? "bg-[#2f241c] text-[#f8efe0] dark:bg-amber-400 dark:text-[#2f241c]"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <BookCard key={item.book.id} book={item.book} reason={item.reason} />
        ))}
      </div>
    </section>
  );
}
