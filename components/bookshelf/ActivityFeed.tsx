import { formatDistanceToNow } from "date-fns";
import type { Activity, Book } from "@/types/bookshelf";

type ActivityItem = Activity & { actorName: string; actorAvatar: string; book: Book };

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="glass-card space-y-4">
      <div>
        <h2 className="display-title text-xl">Friends Activity</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">What your reading circle is doing now.</p>
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
          </li>
        ))}
      </ul>
    </section>
  );
}