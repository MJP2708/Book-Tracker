"use client";

import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import type { Activity, Book } from "@/types/bookshelf";

type ActivityItem = Activity & { actorName: string; actorAvatar: string; book: Book };

type ActivityFeedProps = {
  items: ActivityItem[];
};

type ReactionKind = "congrats" | "like" | "save_quote";

export function ActivityFeed({ items }: ActivityFeedProps) {
  const initialCounts = useMemo(
    () =>
      Object.fromEntries(
        items.map((item) => [
          item.id,
          {
            congrats: 0,
            like: 0,
            save_quote: 0,
          },
        ])
      ),
    [items]
  );

  const [reactions, setReactions] = useState(initialCounts);

  const react = (activityId: string, kind: ReactionKind) => {
    setReactions((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [kind]: (prev[activityId]?.[kind] || 0) + 1,
      },
    }));
  };

  return (
    <section className="glass-card space-y-4">
      <div>
        <h2 className="display-title text-xl">Friends Activity</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">React instantly to keep the community alive.</p>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-stone-200/70 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-sm">
              <span className="font-semibold">{item.actorName}</span>{" "}
              {item.type === "finished" ? "finished" : item.type === "rated" ? "rated" : "added"}{" "}
              <span className="font-semibold">{item.book.title}</span>
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <button type="button" className="secondary-btn h-7 px-2" onClick={() => react(item.id, "congrats")}>
                Congrats {reactions[item.id]?.congrats || 0}
              </button>
              <button type="button" className="secondary-btn h-7 px-2" onClick={() => react(item.id, "like")}>
                Like {reactions[item.id]?.like || 0}
              </button>
              <button type="button" className="secondary-btn h-7 px-2" onClick={() => react(item.id, "save_quote")}>
                Save Quote {reactions[item.id]?.save_quote || 0}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}