"use client";

import { useMemo, useState, useTransition } from "react";
import type { ShelfType, UserBook } from "@/types/bookshelf";
import type { Book } from "@/types/bookshelf";
import { BookCard } from "@/components/bookshelf/BookCard";

type ShelfItem = UserBook & { book: Book };

type ShelfBoardProps = {
  initialShelves: Record<ShelfType, ShelfItem[]>;
};

const shelfTitles: Record<ShelfType, string> = {
  want_to_read: "Want to Read",
  currently_reading: "Currently Reading",
  finished: "Finished",
};

export function ShelfBoard({ initialShelves }: ShelfBoardProps) {
  const [shelves, setShelves] = useState(initialShelves);
  const [draggedItem, setDraggedItem] = useState<{ itemId: string; from: ShelfType } | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalBooks = useMemo(
    () => Object.values(shelves).reduce((sum, books) => sum + books.length, 0),
    [shelves]
  );

  const moveBook = (itemId: string, from: ShelfType, to: ShelfType) => {
    if (from === to) {
      return;
    }

    const movingItem = shelves[from].find((item) => item.id === itemId);
    if (!movingItem) return;

    setShelves((prev) => {
      const fromWithout = prev[from].filter((item) => item.id !== itemId);
      const movedItem = { ...movingItem, shelf: to };
      return {
        ...prev,
        [from]: fromWithout,
        [to]: [movedItem, ...prev[to]],
      };
    });

    startTransition(async () => {
      try {
        await fetch("/api/shelves/move", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userBookId: itemId, fromShelf: from, toShelf: to }),
        });
      } catch {
        setShelves(initialShelves);
      }
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white/80 p-4 dark:border-stone-800 dark:bg-stone-900/70">
        <div>
          <p className="text-sm font-semibold">Your Shelves</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">Drag books to update progress stage.</p>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">{totalBooks} books tracked</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(shelves) as ShelfType[]).map((shelfKey) => (
          <div
            key={shelfKey}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedItem) {
                moveBook(draggedItem.itemId, draggedItem.from, shelfKey);
                setDraggedItem(null);
              }
            }}
            className="min-h-[260px] rounded-2xl border border-stone-200/80 bg-stone-100/70 p-3 dark:border-stone-800 dark:bg-stone-900/60"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="display-title text-sm">{shelfTitles[shelfKey]}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {shelves[shelfKey].length}
              </span>
            </div>

            <div className="space-y-3">
              {shelves[shelfKey].map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItem({ itemId: item.id, from: shelfKey })}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <BookCard book={item.book} progress={item.progress} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isPending ? <p className="text-xs text-stone-500">Syncing shelf update...</p> : null}
    </section>
  );
}